# User Management system specification

# Global Context

This is a NestJS project. It features a layered structure of it's functionalities in order to implement them. We are working directly in memory, not in a DB. Do not generate tests. Instruction for AI: If you want to do something you're not asked to ask for permision and then keep record of them.

# Local Context

A user can be a member of maximum 3 communities simultaneously. For that we implement . Operations can be donde only within members of the same community.
DNI stands for "Documento Nacional de Identidad".

# Technical Restrictions

Its a NEST project with HTTP protocol and outputs/inputs as .json. There are no data bases, only memory-persisting repositories. Its not necessary to add tests nor unnesary comments.

# Service Specification

## Entities to make

### Class _Community_

```typescript
export class Community {
  communityId: number;
  name: string;
  members: User[] = [];
}
```

### Class _User_

```typescript
export class User {
  userId: number;
  name: string;
  lastName: string;
  email: string;
  birthDate: Date;
  dni: number;
  communities: Community[] = [];
}
```

## Permmited operations / flows

### Get user data

- HTTP Request: GET

- Input: 

### Register a user

- HTTP Request: POST.

- Input: name, lastName, email, birthDate, dni.

- Output: 
    - Succesful operation: 204.
    - Missing values: 400
    - DNI already in use: 409

### Unregister a user

- HTTP Request: DELETE

- Input: userId.

- Output: 
    - Succesful operation: 204.
    - User does not exist: 400

- Status code: 200 (OK)

### Unregister a user
### Change user name, lastname, email, birthDate, and DNI.

### User registration

### Conflictive use cases:

- Register a user with a DNI already in use.
- Register a user with an invalid birth date.
- 