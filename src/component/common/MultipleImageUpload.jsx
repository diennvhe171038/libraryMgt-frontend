import { file } from 'jszip';
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

const MultipleImageUpload = ({ label, name, onChange, showError, bookSampleImages }) => {
    const [sampleImageFiles, setSampleImageFiles] = useState([]);
    const [sampleImagePreviews, setSampleImagePreviews] = useState([]);
    const imageInputRef = useRef(null);

    // useEffect(() => {
    //     const loadDefaultValue = async () => {
    //         if (defaultValue && defaultValue.length > 0) {
    //             try {
    //                 const newImagePreviews = [];
    //                 const newImageFiles = [];

    //                 for (let i = 0; i < defaultValue.length; i++) {
    //                     const imageUrl = defaultValue[i].url;
    //                     const response = await fetch(imageUrl);
    //                     const blob = await response.blob();
    //                     const file = new File([blob], defaultValue[i].name, { type: "image/jpeg" });

    //                     newImageFiles.push(file);

    //                     const reader = new FileReader();
    //                     reader.onloadend = () => {
    //                         newImagePreviews.push({ file, preview: reader.result });
    //                         if (newImagePreviews.length === defaultValue.length) {
    //                             setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
    //                         }
    //                     };
    //                     reader.readAsDataURL(file);
    //                 }

    //                 setImageFiles(newImageFiles);
    //             } catch (error) {
    //                 console.error('Error loading defaultValue:', error);
    //                 showError('Error loading defaultValue');
    //             }
    //         }
    //     };

    //     loadDefaultValue();
    // }, [defaultValue, showError]);

    useEffect(() => {
        if (bookSampleImages && bookSampleImages.length > 0) {
            const previews = bookSampleImages.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name
            }));
            setSampleImageFiles(bookSampleImages);
            setSampleImagePreviews(previews);
        }
    }, [bookSampleImages]);

    

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = [];
        const newPreviews = [];
        
        files.forEach((file) => {
            if(!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                showError('Chỉ chấp nhận file ảnh có định dạng jpeg, jpg, png');
            } else if (file.size > 2 * 1024 * 1024) {
                showError('Kích thước ảnh không được lớn hơn 2MB');
            } else {
                validFiles.push(file);
                newPreviews.push({url: URL.createObjectURL(file), name: file.name});
            }
        });

        setSampleImageFiles([...sampleImageFiles, ...validFiles]);
        setSampleImagePreviews([...sampleImagePreviews, ...newPreviews]);

        onChange({ target: { name, files: [...sampleImageFiles, ...validFiles] } });
    };
    
    

    const handleImageRemove = (index) => {
        const newImageFiles = sampleImageFiles.filter((_, fileIndex) => index !== fileIndex);
        const newImagePreviews = sampleImagePreviews.filter((_, previewIndex) => index !== previewIndex);

        setSampleImageFiles(newImageFiles);
        setSampleImagePreviews(newImagePreviews);

        onChange({ target: { name, files: newImageFiles } });

        
    };

    console.log('sampleImageFiles:', sampleImageFiles);
    console.log('sampleImagePreviews:', sampleImagePreviews);

    return (
        <Form.Group className="mb-3">
            {label && <Form.Label className="label">{label}</Form.Label>}
            <Form.Control
                className="field-input"
                type="file"
                multiple
                style={{ fontSize: "small" }}
                name={name}
                ref={imageInputRef}
                onChange={handleImageChange}
            />
            {sampleImagePreviews.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                    <ListGroup>
                        {sampleImagePreviews.map((item, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center" style={{ fontSize: 'small' }}>
                                <img src={item.url} alt={item.name} style={{ maxWidth: '50px', maxHeight: '50px', marginRight: '10px' }} />
                                <span>{item.name}</span>
                                <Button
                                    variant="danger"
                                    onClick={() => handleImageRemove(index)}
                                    style={{
                                        fontSize: 'small',
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        color: '#000'
                                    }}
                                >
                                    <i className="bi bi-trash3"></i>
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </Form.Group>
    );
};

export default MultipleImageUpload;