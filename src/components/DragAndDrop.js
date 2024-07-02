import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import styled, { css, keyframes } from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaCloudUploadAlt } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0.8;
  }
  to {
    opacity: 1;
  }
`;

const shadowFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 0.3;
    transform: scale(1);
  }
`;

const DropzoneContainer = styled.div`
  border: 2.5px dashed #0CA8CC;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  width: 400px;
  height: 100px;
  z-index: 10;
  background: #D6FDD2;

  &:hover {
    background-color: #6DF75F;
  }

  ${props => props.isDragActive && css`
    background-color: #6DF75F;
    box-shadow: 0 0 10px #4F5C4E;
    animation: ${fadeIn} 0.5s ease-in-out;
  `}
`;

const DropzoneMessage = styled.p`
  font-size: 15px;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    margin-right: 8px;
  }
`;

const UploadStatus = styled.p`
  font-size: 14px;
  color: ${props => (props.success ? 'green' : 'red')};
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    margin-right: 8px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 57%;
  left: 18%;
  transform: translate(-10%, -50%);
  width: 80%;
  height: 60%;
  background: #BBDBB7;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  border-radius: 15px;
  transition: background-color 2s ease, box-shadow 3s ease;

  &:hover {
    background-color: #AEE0E3;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const DragAndDrop = () => {
  const [uploadStatus, setUploadStatus] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log('Accepted files:', acceptedFiles);
    console.log('Rejected files:', rejectedFiles);

    if (rejectedFiles.length > 0) {
      setUploadStatus([{ message: <><FaTimesCircle /> Please upload a PDF or JPG file!</>, success: false }]);
      return;
    }

    const newUploadStatus = acceptedFiles.map(file => ({
      fileName: file.name,
      message: <><FaCloudUploadAlt /> Uploading...</>,
      success: false
    }));

    setUploadStatus(newUploadStatus);

    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });

    axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      const results = response.data.split(', ');
      const updatedStatus = results.map((result, index) => ({
        fileName: acceptedFiles[index].name,
        message: <><FaCheckCircle /> {result}</>,
        success: true
      }));
      setUploadStatus(updatedStatus);
      console.log('Files uploaded successfully', response);
    })
    .catch(error => {
      const updatedStatus = acceptedFiles.map(file => ({
        fileName: file.name,
        message: <><FaTimesCircle /> Error uploading {file.name}.</>,
        success: false
      }));
      setUploadStatus(updatedStatus);
      console.error('Error uploading files', error);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf, image/jpeg',
  });

  return (
    <div>
      {isDragActive && <Overlay />}
      <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} multiple />
        <DropzoneMessage><FaCloudUploadAlt /> Drag and drop PDF or JPG files here, or click to select</DropzoneMessage>
        {uploadStatus.map((status, index) => (
          <UploadStatus key={index} success={status.success}>{status.message}</UploadStatus>
        ))}
      </DropzoneContainer>
    </div>
  );
};

export default DragAndDrop;
