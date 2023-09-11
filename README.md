# :ping_pong: Project Overview

This project is a full stack web app allowing a user to register, connect with friends, talk to friends and play with friends.
It is a N(est)R(eact)N(odejs)P(ostges) stack application

### :adult: Registration and Updates interface

- Implementation of OAuth to connect with 42 API
- Implementation of form registration with unique nickname and password and an avatar
- Implementation of two factor authentication with google Authenticator
- Implementation of user information's updates (nickname, password and avatar)
- Implementation of user status updates


### :speech_balloon: Chat interface

- Implementation of real-time communication between user(s)
- Creation of public, private, public with password channels
- Creation of private conversation between two users
- Access to user profile from conversation
- Access to game interface from chat interface
- Implementation of blocking users feature
- Implementation of roles and hierarchy :
    - The owner of a channel is on top of the hierarchy and has the rights to ban/mute/kick others members and admins (He is automatically an admin)
    - The admins of a channel can ban/mute/kick other members but not other admins or the owner
    - The members can only join channels or leave it 


### :ping_pong: Game interface

- Implementation of a live pong 
- Implementation of a matchmaking system - the users can join a queue until they get automatically matched with someone else.
- Implementation of the customisation Options (eg. Power-ups, Different Maps), however, the user should be able to select a default version of the game.
- Implementation of the responsivity for the game


### :technologist:  Friends interface

- Implementation of friends requests
- Implementation of friends acceptance
- Implementation of friends suggestions

### :desktop_computer: User profile interface & Leaderboard

- Access to user profile match history
- Access to user profile statistics
- Access to the leaderboard
- Access to the user profile and informations (status, name ...)


<br>
<br>


# :keyboard: Development

<img alt="React" src="https://img.shields.io/badge/React-20232a.svg?logo=react&logoColor=%2361DAFB"> <img alt="Nest" src="https://img.shields.io/badge/nestjs-%23E0234E.svg?logo=nestjs&logoColor=white"> <img alt="Docker" src="https://img.shields.io/badge/docker-%230db7ed.svg?logo=docker&logoColor=white"> <img alt="PostgreSQL" src ="https://img.shields.io/badge/PostgreSQL-316192.svg?logo=postgresql&logoColor=white"> <img alt="Prisma" src="https://img.shields.io/badge/Prisma-3982CE?logo=Prisma&logoColor=white"> <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white"/>

### :runner: To run th project 
```
For the Authentication with 42 and the connection with the database, a ".env" is needeed with the secret variables
Contact us to get it and run the project with :  docker-compose up --build
```
