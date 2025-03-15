

Group 6 (Local Service Market\)

1. **Aaron Garcia**  
   * **Student ID**: 030556771  
   * **CSULB Email**: Aaron.Garcia01@student.csulb.edu  
2. **Edgar Ruiz**  
   * **Student ID**: 014762317  
   * **CSULB Email**: Edgar.Ruiz01@student.csulb.edu  
3. **Bryan Tieu**  
   * **Student ID**: 028628533  
   * **CSULB Email**: bryan.tieu01@student.csulb.edu  
4. **Ramon Vazquez**  
   * **Student ID**: 032323627
   * **CSULB Email**: ramon.vazquez01@student.csulb.edu
5. **Pierre Maurer**  
   * **Student ID**: 033769734  
   * **CSULB Email**: pierregermain.maurer01@student.csulb.edu

## Preface

| Version | Date | Changes |
| :---- | :---- | :---- |
| 1.0 | 03/14/2025 | Initial Version |

### Purpose

The purpose of this project offers an application to provide a worker profile that lists requirements and information for the employer. Requests are evaluated and job listings are viewed by the employer.
### 

### Audience

The intended audience of this document are the developers (Group 6) and the professor.


## Introduction

The goal is to provide and receive a service from both employers and workers and rate eachother to ensure credibility. It aims to solve by viewing eachother's profiles as a way to validate credentials for its intended hired services.
(Introduce the software project, its goals, and the problem it aims to solve)

### 

### Project Overview

"Local Services Market" is a web based user-interface system as user profiles for employers and workers based on matching geographic locations. It lists all types of required skills, job postings, contact information, and ratings. 

### Project Goals

* Create an appealing and functional UI for profile accounts.

* Updates real time profile information accounts.

* A simple search engine based on geographic location to match profile accounts between employers and workers.

* Functional rating page user-interface.

## Glossary


* **LSM**: An abbreviation for Local Service Market, which is the system that users interact with to access our services.

## 

## User Requirements and Use Cases


### 

### User Stories

1. As an employer, I want to be able to post jobs for workers to find and accept.

2. As a worker, I want to be able to access earnings and see if payments are processed or completed.

3. As an employer, I want to be able to see the progress on a job to ensure my job is being completed on time.

4. As an employer, I want to be able to securely set up a payment system to ensure my workers are paid on time.

5. As a worker, I want to be able to leave reviews so that corrupt or bad employers do not hire new workers or scam anyone else.

6. As an employer, I want to be able to leave reviews so good workers are recognized for good work.

7. As a worker, I want to be able to search jobs that match my skills/experience to ensure I am able to do a job properly.

8. As an employer, I want to be able to search for workers in my area to ensure my jobs are sufficiently scheduled.

9. As a worker, I want to be able to communicate with employers so that I can perform the job correctly.

10. As a worker, I want to be able to customize my profile to ensure that my resume accurately displays my skills/experience.

### 

### Use Case: Adding a New Product

### 

| Identifier | \[UC-4 Job Listing Creation\] |
| :---- | :---- |
| Goal | \[The employer creates a job listing\] |
| Requirements | \[Create job listings that others can accept\] |
| Initiating Actor | \[Employer\] |
| Participating Actor(s) | \[N/A\] |
| Pre-conditions | \[The LSM is online, and the employer has permission to post job listings.\] |
| Post-conditions | \[A job listing is added to the database\] |
| Included Use Case(s) | \[Job Listing\] |
| Extension(s) | \[N/A\] |

### 

***Table 1: Typical Course of Action***

| Seq\# | Actor’s Action | System’s Response |
| :---- | :---- | :---- |
| 1 | The employer signals to the system that they want to create a listing. |  |
| 2 |  | The system acknowledges this and responds with the form. |
| 3 | Employer fills out the form’s relevant information on the webpage in a valid manner. |  |
| 4 |  | System checks whether the input is valid. |
| 5 |  | Once the input is accepted, sends confirmation of valid input. |
| 6 |  | The system then compiles the information and makes it publicly accessible on the website. |

***Table 2: Alternate Course of Action***

| Seq\# | Actor’s Action | System’s Response |
| :---- | :---- | :---- |
| 1 | The employer signals to the system that they want to create a listing. |  |
| 2 |  | The system responds with the form. |
| 3 | Employer fills out and sends the forms to create new job but with invalid input (ex: title job to short). |  |
| 4 |  | System determines that the input is invalid. |
| 5 |  | System rejects the request because there is some invalid input, the system will send an error with an explanation about the error. |
| 6 | Employer corrects the invalid input. |  |
| 7 |  | System checks whether the input is valid. |
| 8 |  | Once the input is accepted, sends confirmation of valid input. |
| 9 |  | The system then compiles the information and makes it publicly accessible on the website. |

***Table 3: Exceptional Course of Action***

| Seq\# | Actor’s Action | System’s Response |
| :---- | :---- | :---- |
| 1 | Employer attempts to create job listing. |  |
| 2 |  | System’s database is not accessible. |
| 3 |  | System tells the user that their request cannot be met at the moment. |


## 

## System Architecture

(Describe the high-level design of the software.)

### 

### Components

### 

### Deployment Diagram
