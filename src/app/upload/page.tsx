'use client';

import { useState, useRef } from 'react';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import toast from 'react-hot-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useFormData } from '@/hooks/useLocalStorage';
import { forensicService } from '@/lib/services/forensic';
import {
    faCloudUploadAlt, faFileAlt, faCalendarAlt, faMapMarkerAlt,
    faLock, faCamera, faCheckCircle, faInfoCircle, faTimes
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

export default function UploadPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { playSuccess, playError, playClick } = useSoundEffects();
    const { formData, updateField, resetForm } = useFormData('upload', {
        dateOfIncident: '',
        location: '',
        classification: '',
        description: '',
    });


    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
        playClick();
        toast.success(`${droppedFiles.length} file(s) added`);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);
        playClick();
        toast.success(`${selectedFiles.length} file(s) selected`);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        playClick();
        toast('File removed', { icon: '🗑️' });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            playError();
            toast.error('Please add at least one evidence file');
            return;
        }

        const newItemsPromises = files.map(async (file) => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            
            let imageSrc = '';
            if (isImage && file.size < 2 * 1024 * 1024) {
                imageSrc = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            }

            let formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (formData.dateOfIncident) {
                const d = new Date(formData.dateOfIncident);
                if (!isNaN(d.getTime())) {
                    formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                }
            }

            const item = {
                id: crypto.randomUUID(),
                title: file.name,
                type: isImage ? 'typeImage' : (isVideo ? 'typeVideo' : 'typeDocument'),
                typeText: isImage ? 'Image' : (isVideo ? 'Video' : 'Document'),
                status: 'statusUploaded',
                statusText: 'Uploaded',
                date: new Date().toISOString(),
                caseRef: `EV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                collector: 'Current User',
                notes: formData.description || 'Evidence uploaded via portal.',
                tags: [formData.classification].filter(Boolean),
                imageSrc: imageSrc
            };

            console.log('UPLOAD PAYLOAD:', item);
            await forensicService.uploadEvidence(item);
            return item;
        });

        try {
            await Promise.all(newItemsPromises);

            playSuccess();
            toast.success('Case submitted successfully to cloud database!', { duration: 4000 });
            setFiles([]);
            resetForm();
        } catch (error: any) {
            console.error('FULL UPLOAD ERROR:', error);
            playError();

            let message = 'Upload failed';

            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === 'string') {
                message = error;
            } else if (error?.message) {
                message = error.message;
            }

            toast.error(`Upload Failed: ${message}`, { duration: 5000 });
        }
    };

    return (
        <PageLoader type="upload">
        <div className={styles.upload} role="main" aria-label="Upload case page">
            <div className="container">
                <h1>Upload Case</h1>
                <p>Submit new case data and evidence files for processing</p>

                <div className={styles.uploadContainer}>
                    <div className={styles.uploadSection}>
                        <h2>Case Information</h2>
                        <div className={styles.uploadForm}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="caseId"><FAIcon icon={faFileAlt} /> Case ID</label>
                                    <input id="caseId" type="text" placeholder="Auto-generated" readOnly aria-label="Case ID" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="incidentDate"><FAIcon icon={faCalendarAlt} /> Date of Incident</label>
                                    <input id="incidentDate" type="date" value={formData.dateOfIncident} onChange={(e) => updateField('dateOfIncident', e.target.value)} aria-label="Date of incident" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="location"><FAIcon icon={faMapMarkerAlt} /> Location</label>
                                    <input id="location" type="text" placeholder="Enter crime scene location" value={formData.location} onChange={(e) => updateField('location', e.target.value)} aria-label="Crime scene location" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="classification"><FAIcon icon={faLock} /> Classification</label>
                                    <select id="classification" style={{ background: '#161b2a', color: '#ffffff' }} value={formData.classification} onChange={(e) => updateField('classification', e.target.value)} aria-label="Case classification">
                                        <option value="" style={{ background: '#121826', color: '#ffffff' }}>Select classification</option>
                                        <option style={{ background: '#121826', color: '#ffffff' }}>Homicide</option>
                                        <option style={{ background: '#121826', color: '#ffffff' }}>Burglary</option>
                                        <option style={{ background: '#121826', color: '#ffffff' }}>Traffic Accident</option>
                                        <option style={{ background: '#121826', color: '#ffffff' }}>Cyber Crime</option>
                                        <option style={{ background: '#121826', color: '#ffffff' }}>Assault</option>
                                        <option style={{ background: '#121826', color: '#ffffff' }}>Fraud</option>
                                        <option style={{ background: '#121826', color: '#ffffff' }}>Other</option>
                                    </select>
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label htmlFor="description">Case Description</label>
                                    <textarea id="description" rows={4} placeholder="Provide detailed description of the incident..." value={formData.description} onChange={(e) => updateField('description', e.target.value)} aria-label="Case description"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.uploadSection}>
                        <h2>Evidence Files</h2>
                        <div
                            className={`${styles.fileUploadArea} ${isDragging ? styles.dragOver : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            aria-label="Drag and drop evidence files or click to browse"
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                        >
                            <div className={styles.uploadIcon}>
                                <FAIcon icon={faCloudUploadAlt} />
                            </div>
                            <h3>Drag & Drop Files Here</h3>
                            <p>or click to browse</p>
                            <p className={styles.uploadHint}>
                                Supported formats: Images (JPG, PNG), Videos (MP4, AVI), Documents (PDF, DOC)
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileInputChange}
                                aria-label="Select evidence files"
                            />
                        </div>

                        {files.length > 0 && (
                            <div className={styles.fileList} role="list" aria-label="Selected files">
                                {files.map((file, index) => (
                                    <div key={index} className={styles.fileItem} role="listitem">
                                        <div className={styles.fileInfo}>
                                            <FAIcon icon={faFileAlt} className={styles.fileIcon} />
                                            <div>
                                                <div className={styles.fileName}>{file.name}</div>
                                                <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                                            </div>
                                        </div>
                                        <div
                                            className={styles.fileRemove}
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Remove ${file.name}`}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); removeFile(index); } }}
                                        >
                                            <FAIcon icon={faTimes} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.uploadSection}>
                        <h2>Upload Guidelines</h2>
                        <div className={styles.guidelinesList}>
                            <div className={styles.guideline}>
                                <div className={styles.guidelineIcon}><FAIcon icon={faCamera} /></div>
                                <div>
                                    <h3>Photo Guidelines</h3>
                                    <p>High-resolution photos with proper lighting. Include scale markers and evidence tags.</p>
                                </div>
                            </div>
                            <div className={styles.guideline}>
                                <div className={styles.guidelineIcon}><FAIcon icon={faCheckCircle} /></div>
                                <div>
                                    <h3>Chain of Custody</h3>
                                    <p>All uploads are automatically logged with timestamp, user, and hash verification.</p>
                                </div>
                            </div>
                            <div className={styles.guideline}>
                                <div className={styles.guidelineIcon}><FAIcon icon={faInfoCircle} /></div>
                                <div>
                                    <h3>Metadata Preservation</h3>
                                    <p>Original file metadata is preserved. EXIF data from images is automatically extracted.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button className="btn btn-primary" onClick={handleSubmit} aria-label="Submit case">
                            <FAIcon icon={faCloudUploadAlt} /> Submit Case
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </PageLoader>
    );
}
