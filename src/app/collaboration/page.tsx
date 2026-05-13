"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FAIcon from "@/components/FontAwesome";
import PageLoader from "@/components/PageLoader";
import VideoCall from "@/components/VideoCall";
import toast from "react-hot-toast";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import {
  forensicService,
  type SharedFileRow,
  type ProfileRow,
} from "@/lib/services/forensic";
import { supabase } from "@/lib/supabase/client";
import {
  faUsers,
  faUser,
  faShieldAlt,
  faClock,
  faFileAlt,
  faComments,
  faPaperclip,
  faPaperPlane,
  faAt,
  faCircle,
  faTasks,
  faTrash,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./page.module.css";

type TeamMemberView = {
  id: string;
  name: string;
  role: string;
  designation?: string | null;
  phone?: string | null;
  status: string;
  statusText: string;
  primary: boolean;
};

const fallbackTeam: TeamMemberView[] = [];

const statusCycle = ["online", "away", "offline"] as const;
const statusTextMap: Record<string, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

type MessageRow = {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
  senderId: string | null;
  avatar: typeof faUser;
};

type ActivityRow = {
  title: string;
  desc: string;
  time: string;
  case: string;
  icon: typeof faFileAlt;
};

function profilesToTeam(rows: ProfileRow[]): TeamMemberView[] {
  return rows.map((p, i) => {
    const st = statusCycle[i % statusCycle.length];
    return {
      id: p.id,
      name: p.display_name || "Team member",
      role: p.role,
      designation: p.designation,
      phone: p.phone,
      status: st,
      statusText: statusTextMap[st],
      primary: i === 0,
    };
  });
}

export default function CollaborationPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("You");
  const [teamMembers, setTeamMembers] =
    useState<TeamMemberView[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFileRow[]>([]);
  const [uploadBusy, setUploadBusy] = useState(false);
  const { playMessage, playClick } = useSoundEffects();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled || !session?.user) return;
      const uid = session.user.id;
      setUserId(uid);
      try {
        const profile = await forensicService.getProfile(uid);
        setDisplayName(
          profile?.display_name ||
            session.user.email?.split("@")[0] ||
            "You",
        );
      } catch {
        setDisplayName(session.user.email?.split("@")[0] || "You");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadTeam = useCallback(async () => {
    try {
      const rows = await forensicService.listProfiles();
      setTeamMembers(profilesToTeam(rows));
    } catch (err) {
      console.error("Failed to load team:", err);
    }
  }, []);

  useEffect(() => {
    void loadTeam();
    const sub = forensicService.subscribe("profiles", loadTeam);
    return () => {
      sub.unsubscribe();
    };
  }, [loadTeam]);

  const loadSharedFiles = useCallback(async () => {
    try {
      const list = await forensicService.listSharedFiles();
      setSharedFiles(list);
    } catch {
      toast.error("Could not load shared files");
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadSharedFiles();
    }, 0);
    return () => clearTimeout(id);
  }, [loadSharedFiles]);

  const fetchData = useCallback(async () => {
    try {
      const [msgs, acts] = await Promise.all([
        forensicService.getMessages(userId),
        forensicService.getActivities(),
      ]);
      setMessages(
        msgs.map((m: any) => ({
          ...m,
          avatar: faUser,
        })) as MessageRow[],
      );
      setActivities(
        acts.map((a: any) => ({
          ...a,
          icon: faFileAlt,
        })) as ActivityRow[],
      );
    } catch (e) {
      console.error(e);
    }
  }, [userId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchData();
    }, 0);
    const msgSub = forensicService.subscribe("messages", fetchData);
    const actSub = forensicService.subscribe("activities", fetchData);
    const fileSub = forensicService.subscribe(
      "shared_files",
      loadSharedFiles,
    );
    return () => {
      clearTimeout(timer);
      msgSub.unsubscribe();
      actSub.unsubscribe();
      fileSub.unsubscribe();
    };
  }, [fetchData, loadSharedFiles]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.endsWith("@")) setShowMentions(true);
    else if (!val.includes("@")) setShowMentions(false);
  };

  const insertMention = (name: string) => {
    setInputValue((prev) => prev.replace(/@$/, `@${name} `));
    setShowMentions(false);
    playClick();
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!userId) {
      toast.error("You must be signed in to chat.");
      return;
    }

    const msgText = inputValue;
    setInputValue("");
    setShowMentions(false);

    try {
      await forensicService.sendMessage(msgText, userId, displayName);
      playMessage();
      await fetchData();
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) {
      if (!userId) toast.error("Sign in to upload files.");
      return;
    }
    setUploadBusy(true);
    try {
      await forensicService.uploadSharedFile(file, userId);
      toast.success("File shared with the team");
      await loadSharedFiles();
    } catch {
      toast.error("Upload failed — check Storage bucket and policies.");
    } finally {
      setUploadBusy(false);
    }
  };

  const handleDownload = async (path: string) => {
    try {
      const url = await forensicService.getSharedFileSignedUrl(path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Could not create download link");
    }
  };

  const handleDeleteFile = async (f: SharedFileRow) => {
    if (!userId) return;
    try {
      await forensicService.deleteSharedFile(
        f.id,
        f.storage_path,
        f.uploaded_by,
        userId,
      );
      toast.success("File removed");
      await loadSharedFiles();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
    }
  };

  return (
    <PageLoader type="collaboration">
      <div
        className={styles.collaboration}
        role="main"
        aria-label="Collaboration page"
      >
        <div className="container">
          <h1>Collaboration</h1>
          <p>Team workspace and real-time communication</p>

          <div className="section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>
                <FAIcon icon={faUsers} /> Team Members
              </h2>
            </div>
            <div className={styles.teamGrid}>
              {teamMembers.map((m, i) => (
                <div key={m.id || i} className={styles.teamMember}>
                  <div
                    className={`${styles.memberAvatar} ${m.primary ? styles.primary : ""}`}
                  >
                    <FAIcon icon={faUser} />
                    <span
                      className={`${styles.statusDot} ${styles[m.status]}`}
                    ></span>
                  </div>
                  <div className={styles.memberInfo}>
                    <h3>{m.name}</h3>
                    <p className={styles.memberRole}>{m.designation || m.role}</p>
                    {m.phone && <p className={styles.memberPhone}>{m.phone}</p>}
                    <span
                      className={`${styles.memberStatus} ${styles[m.status]}`}
                    >
                      {m.statusText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageLoader>
  );
}
