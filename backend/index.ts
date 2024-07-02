//JS CODE - works and is functional with the allowing pdf and jpg 

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const port = 3001;

// // Configure Multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); //Set destinatioon folder for uploads. which is uploads directory. 
//     },
//     //determines how files should be named 
//     filename: (req, file, cb) => {
//         cb(null, file.originalname); //Set uploaded file's name to its orignal name. 
//     }
// });

// // Accept all file types
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         cb(null, true);
//     }
// });

// // Custom middleware to validate files
// const validateFiles = (req, res, next) => {
//     const files = req.files; //access uploaded files 
//     const validFiles = []; //arrays to store PDFs and jpgs 
//     const invalidFiles = []; //array to store rejected files 

//     //iterate through uploaded files 
//     files.forEach(file => {
//         if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg') {
//             validFiles.push(file); //add to valid files if the MIME type is PDF or jpg 
//         } else {
//             invalidFiles.push(file); //Add to invalid files if MIME type not PDF nor jpg 
//         }
//     });

    
//     //By attaching these arrays to req object, the code makes this information available to any subsequent middleware or route handlers.
//     //that way main router handler can later use req.validFiles and req.invalidFiles to log info and process files. 
//     req.validFiles = validFiles; //Attach valid files to request object 
//     req.invalidFiles = invalidFiles; //attach invalid to request object.


//     next(); //Proceed to next middleware or route handler 
// };

// // Endpoint for uploading multiple files locally
// app.post('/upload', upload.array('files'), validateFiles, (req, res) => {
//     console.log('Valid files:', req.validFiles); //Log valid files to console 
//     console.log('Invalid files:', req.invalidFiles); //log invalid files to console 

//     //if no valid pdf uploaded, return an error response 
//     if (req.validFiles.length === 0) {
//         return res.status(400).send('Please upload at least one PDF or JPG file!');
//     }

//     //Create promises to handle file uploads 
//     const uploadPromises = req.validFiles.map(file => { //creates a list of promises, one for each good file. Map applies func to each item in valid files (req.validFiles) 
//         return new Promise((resolve, reject) => { //for each file, creates a new promise. But something to do later. Handles Asynchronous operations. 
//             const filepath = path.join(__dirname, file.path); //filepath = current location of file 
//             const targetpath = path.join(__dirname, 'uploads', file.originalname); //targetpath = destination to move file to  
//             //path.join = creating proper file paths. 

//             //fs.rename = used to move file from temp location to target location (destination) 
//             fs.rename(filepath, targetpath, (err) => {
//                 //if there's an error then promise is rejected. If successfull then promise is resolved with a successful message. 
//                 if (err) {
//                     reject(err); //reject promise if error 
//                 } else {
//                     resolve(`File ${file.originalname} uploaded successfully`); //resolve promise with file object 
//                 }
//             });
//         });
//     });
    
    
//     //handle all upload promises 
//     //Think of promises like little notes to give each friend 
//     //Promise.all(uploadsPromises) says gonna wait till everyone has submitted their little notes back to you 
//     Promise.all(uploadPromises) //only when all friends are done, or rather when all promises are resolved, then it proceeds  
//         //after all promises uploaded -> .then is activated 
//         .then(results => { //const results = await promise.allpromises - need to figure out how to change this to TS  
//             let message = results.join(', '); //this just says joining all the promises (responses) into a long sentence. 
//             if (req.invalidFiles.length > 0) { //if any friend had a prob then let's add that to the message. essentially if rejected file > 0, the nwe add the message below. 
//                 message += `, but some files were rejected: ${req.invalidFiles.map(file => file.originalname).join(', ')}`;
//             }
//             res.status(200).send(message); //message delivery for accepted and rejected 
//         })
//         .catch(error => { //if a promise is rejected (unfulfiled) then .catch is activated 
//             console.error('Error uploading files:', error); //catches the problem and pushes an error message, for upload error. 
//             res.status(500).send('Error uploading files');
//         });
// });


// // Start server
// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`); //server start message
// });




//do it in ts 
// encorp in function defs - argument types and names, as well return types 
// distinguish between async and promise.





//NEW TYPESCRIPT need to change to allow jpg 

import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3001;

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the destination folder for uploads
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Set uploaded file's name to its original name
    }
});

// Accept all file types
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb: FileFilterCallback) => {
        cb(null, true); // Accept all files
    }
});

// Custom middleware to validate files
const validateFiles = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[]; // Access uploaded files
    const validFiles: Express.Multer.File[] = []; // Array to store PDFs
    const invalidFiles: Express.Multer.File[] = []; // Array to store non-PDFs

    // Iterate through uploaded files
    files.forEach(file => {
        if (file.mimetype === 'application/pdf') {
            validFiles.push(file); // Add to valid files if the MIME type is PDF
        } else {
            invalidFiles.push(file); // Add to invalid files if MIME type is not PDF
        }
    });

    req.validFiles = validFiles; // Attach valid files to request object
    req.invalidFiles = invalidFiles; // Attach invalid files to request object

    next(); // Proceed to next middleware or route handler
};

// Endpoint for uploading multiple files locally
app.post('/upload', upload.array('files'), validateFiles, async (req: Request, res: Response) => {
    console.log('Valid files:', req.validFiles); // Log valid files to console
    console.log('Invalid files:', req.invalidFiles); // Log invalid files to console

    // If no valid PDFs uploaded, return an error response
    if (req.validFiles.length === 0) {
        return res.status(400).send('Please upload at least one PDF file!');
    }

    // Create promises to handle file uploads
    const uploadPromises: Promise<string>[] = req.validFiles.map(file => {
        return new Promise((resolve, reject) => {
            const filepath = path.join(__dirname, file.path); // Get file path
            const targetpath = path.join(__dirname, 'uploads', file.originalname); // Define target path

            // Rename (move) file to target path
            fs.rename(filepath, targetpath, (err) => {
                if (err) {
                    reject(err); // Reject promise if error
                } else {
                    resolve(`File ${file.originalname} uploaded successfully`); // Resolve promise with file object
                }
            });
        });
    });

    // Handle all upload promises
    try {
        const results = await Promise.all(uploadPromises); // Wait for all promises to resolve
        // Send JSON response with valid and invalid files
        let message = results.join(', ');
        if (req.invalidFiles.length > 0) {
            message += `, but some files were rejected: ${req.invalidFiles.map(file => file.originalname).join(', ')}`;
        }
        res.status(200).send(message);
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).send('Error uploading files');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`); // Server start message
});
