#### Backend Task

# Lead Management

Our organization needs a brand new lead management system. they want to import current leads through the one API and review them. your job is to provide such an API for them.

**IMPORTANT NOTE: First read all steps, scope your target implementation and inform us about your submit prediction date.**


## Steps
### 1- lead import

each lead has at least `Name`, `Family Name`, `Email`, and `Cellphone`. we want to import leads in one API call. the desired output is:

- number of leads imported successfully
- number of leads that failed to import with this detail record for each failure
  - `Name` `Family` `Email` `Cellphone` `**Reason**`
  - Reason can be
    - email or phone already exists
    - email/phone not provided or invalid

### 2- lead manager

The lead manager has at least a `Name`, we need an API to:

- Add/Remove lead manager and search through them
- Assign a lead to the manager
  - Each lead only has one assignee at any time
- Mark a lead as `interested` or not `interested`
  - After it the lead manager is free (i.e assign to the new lead)
- oldest lead should use for re-assigning

### 3 - Notify Others

publish a simple desirable message `lead_interested_created` when a lead mark as interested

- the message should be received by other services in case of any failure
- the message broker should be transparent to the application and can change with extension

### 4 - A read streamed API

- A read streamed API for leads with filters
- publish a client package for the reading of stream on each release

### Task Note:

- We don't need authentication and authorization for this task!
- Don't worry about transportation layers BETWEEN processes (you can assume all transports are fault tolerant)
- Propose a way for using your APIs
- Propose/implement a way for it's deployment

### Technical Evaluation

- make sure it's ready for production and easy to use for your colleagues
- clean idiomatic well-tested code
- simple setup/startup
- well-structure, extend-able and a bit over-designed for future

### Technologies

    - Node.js (TypeScript is highly recommended)
    - Preferably with simple/lightweight http framework (e.g express)
    - PostgreSQL
