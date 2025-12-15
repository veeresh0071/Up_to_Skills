# UpToSkills Project Structure

This document outlines the folder structure of the UpToSkills project.

├───.gitignore

├───components.json

├───config-overrides.js

├───debug_enrollment.js

├───eslint.config.js

├───package-lock.json

├───package.json

├───postcss.config.js

├───README.md

├───tailwind.config.js

├───.git\

├───backend\

│   ├───addCandidateIdToInterviews.js

│   ├───addColumn.js

│   ├───db.js

│   ├───package-lock.json

│   ├───package.json

│   ├───server.js

│   ├───test-db.js

│   ├───config\

│   │   └───database.js

│   ├───controllers\

│   │   ├───companies.controller.js

│   │   ├───companyProfiles.controller.js

│   │   ├───coursesController.js

│   │   ├───enrollment.controller.js

│   │   ├───form.controller.js

│   │   ├───notifications.controller.js

│   │   ├───programs.controller.js

│   │   ├───skillBadges.controller.js

│   │   ├───stats.controller.js

│   │   └───students.controller.js

│   ├───middleware\

│   │   ├───auth.js

│   │   └───upload.js

│   ├───node_modules\

│   ├───routes\

│   │   ├───addproject.js

│   │   ├───assignedPrograms.js

│   │   ├───auth.js

│   │   ├───companies.route.js

│   │   ├───companyProfiles.route.js

│   │   ├───courses.route.js

│   │   ├───debugRoutes.js

│   │   ├───enrollmentRoutes.js

│   │   ├───enrollments.js

│   │   ├───forgotPassword.js

│   │   ├───formRoutes.js

│   │   ├───interviews.js

│   │   ├───mentor_projects.js

│   │   ├───mentorReviews.js

│   │   ├───mentors.js

│   │   ├───notifications.js

│   │   ├───projects.js

│   │   ├───searchcompanies.js

│   │   ├───searchproject.js

│   │   ├───searchStudents.js

│   │   ├───skillBadges.js

│   │   ├───stats.js

│   │   ├───studentProjects.js

│   │   ├───students.js

│   │   ├───testEnrollment.js

│   │   ├───testimonials.js

│   │   └───userProfile.js

│   ├───scripts\

│   │   ├───backfillCandidateId.js

│   │   ├───initDB.js

│   │   └───scripts.js

│   ├───uploads\

│   └───utils\

│       ├───ensureAdminBootstrap.js

│       ├───ensureNotificationsTable.js

│       ├───ensureProgramAssignmentsTable.js

│       └───notificationService.js

├───build\

├───node_modules\

├───public\

│   ├───contact-illustration.png

│   ├───favicon.png

│   ├───image3.png

│   ├───index.html

│   └───uptoskills_logo.png

└───src\
    
    ├───App.css
    
    ├───App.jsx
    
    ├───index.css
    
    ├───index.js
    
    ├───assets\
    
    │   ├───bgc.jpeg
    
    │   ├───boy2.png
    
    │   ├───buisness.jpeg
    
    │   ├───community2.png
    
    │   ├───darkLogo.jpg
    
    │   ├───her0Section.jpeg
    
    │   ├───hero.jpg
    
    │   ├───login-new.jpg
    
    │   ├───loginnew.jpg
    
    │   ├───logo.png
    
    │   └───mentor_illustration.png
    
    ├───components\
    
    │   ├───AboutPage\
    
    │   │   ├───AboutSection.jsx
    
    │   │   ├───Footer.jsx
    
    │   │   ├───Header.jsx
    
    │   │   ├───HeroSection.jsx
    
    │   │   ├───ProgramsSection.jsx
    
    │   │   └───Testimonials.jsx
    
    │   ├───AdminPanelDashboard\
    
    │   │   ├───AdminNavbar.jsx
    
    │   │   ├───AdminNotifications.jsx
    
    │   │   ├───AdminSidebar.jsx
    
    │   │   ├───Analytics.jsx
    
    │   │   ├───AssignedPrograms.jsx
    
    │   │   ├───Card.jsx
    
    │   │   ├───CompaniesTable.jsx
    
    │   │   ├───Company.jsx
    
    │   │   ├───CoursesTable.jsx
    
    │   │   ├───DashboardMain.jsx
    
    │   │   ├───MentorReview.jsx
    
    │   │   ├───Mentors.jsx
    
    │   │   ├───MentorsTable.jsx
    
    │   │   ├───Programs.jsx
    
    │   │   ├───ProgramsAdmin.jsx
    
    │   │   ├───Project.jsx
    
    │   │   ├───Students.jsx
    
    │   │   ├───StudentsTable.jsx
    
    │   │   └───Testimonials.jsx
    
    │   ├───Company_Dashboard\
    
    │   │   ├───ui\
    
    │   │   │   ├───accordion.jsx
    
    │   │   │   ├───alert-dialog.jsx
    
    │   │   │   ├───alert.jsx
    
    │   │   │   ├───aspect-ratio.jsx
    
    │   │   │   ├───avatar.jsx
    
    │   │   │   ├───badge.jsx
    
    │   │   │   ├───breadcrumb.jsx
    
    │   │   │   ├───button.jsx
    
    │   │   │   ├───calendar.jsx
    
    │   │   │   ├───card.jsx
    
    │   │   │   ├───carousel.jsx
    
    │   │   │   ├───chart.jsx
    
    │   │   │   ├───checkbox.jsx
    
    │   │   │   ├───collapsible.jsx
    
    │   │   │   ├───command.jsx
    
    │   │   │   ├───context-menu.jsx
    
    │   │   │   ├───dialog.jsx
    
    │   │   │   ├───drawer.jsx
    
    │   │   │   ├───dropdown-menu.jsx
    
    │   │   │   ├───form.jsx
    
    │   │   │   ├───hover-card.jsx
    
    │   │   │   ├───input-otp.jsx
    
    │   │   │   ├───input.jsx
    
    │   │   │   ├───label.jsx
    
    │   │   │   ├───menubar.jsx
    
    │   │   │   ├───navigation-menu.jsx
    
    │   │   │   ├───pagination.jsx
    
    │   │   │   ├───popover.jsx
    
    │   │   │   ├───progress.jsx
    
    │   │   │   ├───radio-group.jsx
    
    │   │   │   ├───resizable.jsx
    
    │   │   │   ├───scroll-area.jsx
    
    │   │   │   ├───select.jsx
    
    │   │   │   ├───separator.jsx
    
    │   │   │   ├───sheet.jsx
    
    │   │   │   ├───sidebar.jsx
    
    │   │   │   ├───skeleton.jsx
    
    │   │   │   ├───slider.jsx
    
    │   │   │   ├───sonner.jsx
    
    │   │   │   ├───switch.jsx
    
    │   │   │   ├───table.jsx
    
    │   │   │   ├───tabs.jsx
    
    │   │   │   ├───textarea.jsx
    
    │   │   │   ├───toast.jsx
    
    │   │   │   ├───toaster.jsx
    
    │   │   │   ├───toggle-group.jsx
    
    │   │   │   ├───toggle.jsx
    
    │   │   │   ├───tooltip.jsx
    
    │   │   │   └───use-toast.js
    
    │   │   ├───3DHiringAnimation.jsx
    
    │   │   ├───AboutCompanyPage.jsx
    
    │   │   ├───CompanyNotificationsPage.jsx
    
    │   │   ├───companyProfilePage.jsx
    
    │   │   ├───ContactModal.jsx
    
    │   │   ├───EditProfile.jsx
    
    │   │   ├───InterviewGallery.jsx
    
    │   │   ├───InterviewsSection.jsx
    
    │   │   ├───Navbar.jsx
    
    │   │   ├───SearchFilters.jsx
    
    │   │   ├───SearchStudents.jsx
    
    │   │   ├───Sidebar.jsx
    
    │   │   ├───StatCard.jsx
    
    │   │   ├───StudentCard.jsx
    
    │   │   └───StudentProfileModal.jsx
    
    │   ├───Contact_Page\
    
    │   │   ├───Chatbot.jsx
    
    │   │   ├───Contact.jsx
    
    │   │   ├───Faq.jsx
    
    │   │   ├───Footer.jsx
    
    │   │   ├───Header.jsx
    
    │   │   └───InputField.jsx
    
    │   ├───MentorDashboard\
    
    │   │   ├───components\
    
    │   │   │   ├───SkillBadges\
    
    │   │   │   │   ├───SkillBadgeForm.css
    
    │   │   │   │   └───SkillBadgeForm.jsx
    
    │   │   │   ├───DashboardCard.jsx
    
    │   │   │   ├───DomainsOfInterest.jsx
    
    │   │   │   ├───Footer.jsx
    
    │   │   │   ├───Header.jsx
    
    │   │   │   ├───MentorDashboardLayout.jsx
    
    │   │   │   ├───MentorEditProfilePage.jsx
    
    │   │   │   ├───MentorProfilePage.jsx
    
    │   │   │   ├───NotificationsPanel.jsx
    
    │   │   │   ├───Sidebar.jsx
    
    │   │   │   ├───StudentProfileForm.jsx
    
    │   │   │   └───Welcome.jsx
    
    │   │   └───pages\
    
    │   │       ├───NotificationsPage\
    
    │   │       │   ├───NotificationPage.css
    
    │   │       │   └───NotificationsPage.jsx
    
    │   │       ├───AboutUs.jsx
    
    │   │       ├───AssignedPrograms.jsx
    
    │   │       ├───Feedback.jsx
    
    │   │       ├───MentorDashboardPage.jsx
    
    │   │       ├───MentorTracking.jsx
    
    │   │       ├───MultiStudent.jsx
    
    │   │       ├───OpenSourceContributions.jsx
    
    │   │       └───ProjectsProgress.jsx
    
    │   ├───Notifications\
    
    │   │   ├───NotificationCenter.jsx
    
    │   │   └───NotificationDrawer.jsx
    
    │   ├───Programs\
    
    │   │   ├───Cloudcompute.jsx
    
    │   │   ├───CoursesList.jsx
    
    │   │   ├───Cybersecurity.jsx
    
    │   │   ├───Datascience.jsx
    
    │   │   ├───Loading.css
    
    │   │   ├───Thankyou.jsx
    
    │   │   └───Webdev.jsx
    
    │   ├───Project_Showcase\
    
    │   │   ├───Footer.jsx
    
    │   │   ├───ProjectCard.jsx
    
    │   │   ├───ProjectModal.jsx
    
    │   │   ├───ProjectShowcase.jsx
    
    │   │   └───Sidebar.jsx
    
    │   ├───Student_Dashboard\
    
    │   │   ├───dashboard\
    
    │   │   │   ├───AboutUs.jsx
    
    │   │   │   ├───AssignmentsSection.jsx
    
    │   │   │   ├───BottomProfileMessages.jsx
    
    │   │   │   ├───CalendarWidget.jsx
    
    │   │   │   ├───ChartSection.jsx
    
    │   │   │   ├───Dashboard_Project.jsx
    
    │   │   │   ├───Footer.jsx
    
    │   │   │   ├───Header.jsx
    
    │   │   │   ├───MyCourses.jsx
    
    │   │   │   ├───MyPrograms.jsx
    
    │   │   │   ├───NoticeBoard.jsx
    
    │   │   │   ├───Sidebar.jsx
    
    │   │   │   ├───StatsGrid.jsx
    
    │   │   │   └───WelcomeSection.jsx
    
    │   │   ├───EditProfile\
    
    │   │   │   ├───BasicInformation.jsx
    
    │   │   │   ├───ContactInformation.jsx
    
    │   │   │   ├───DomainsOfInterest.jsx
    
    │   │   │   ├───EditProfilePage.jsx
    
    │   │   │   ├───FormActions.jsx
    
    │   │   │   ├───FormContent.jsx
    
    │   │   │   ├───FormHeader.jsx
    
    │   │   │   ├───ProfessionalDetails.jsx
    
    │   │   │   ├───Resume.jsx
    
    │   │   │   ├───Skills.jsx

    │   │   │   └───StudentProfileForm.jsx

    │   │   ├───myProjects\

    │   │   │   ├───AddProject.jsx

    │   │   │   ├───MyProjects.jsx

    │   │   │   └───ProjectSubmissionForm.jsx

    │   │   ├───NotificationsPage\

    │   │   │   ├───NotificationPage.css
    
    │   │   │   └───NotificationsPage.jsx

    │   │   ├───Skilledpage\

    │   │   │   ├───AchievementCard.jsx

    │   │   │   └───StudentSkillBadgesPage.jsx

    │   │   ├───student_dashboard.css

    │   │   └───UserProfilePage.jsx

    │   └───ProtectedRoute.jsx

    ├───context\

    │   └───ThemeContext.jsx

    ├───hooks\

    │   ├───use-mobile.jsx

    │   ├───use-toast.js

    │   ├───useRealtimeNotifications.js

    │   └───useSubmitContactForm.js

    ├───lib\

    │   └───utils.js

    └───pages\
        ├───AdminPanel.jsx

        ├───ContactPage.jsx

        ├───ForgotPassword.jsx

        ├───Index.jsx

        ├───Landing.jsx

        ├───Login.jsx

        ├───MentorDashboardRoutes.jsx

        ├───NotFound.jsx

        ├───ProgramsPage.jsx

        ├───ProjectShowcasePage.jsx

        ├───Register.jsx

        ├───Student_Dashboard.jsx

        └───Unauthorized.jsx



# 2025-10-16
-Mentor dashbord, Student dashboard- social media icon section

-Company dashboard candidate profile modal -the contact, email, phone number, profile info

-Company dashbord: Edit profile feature working

-Register page: UIadjustment, mentor-dashbord skill badges with backend, UI Research

# 2025-10-17
-Homepage: What we offer Icons must reflect as what they are

-About: by clicking Hire as Student take to mentor registration page

-Contact: Mail by clicking open to mail to uptoskills

-AdminPanel:sidebar; mentor section 

-Company Dashboard :In place of Student use candidate ,Company search students by name or skill ,Add the no.of students changed

-Contact Page : Send us message fix and the mail must be sent to the company

-Dashboard :Shift my project to main dashboard page

-Homepage: program section loader , Footer consistent everywhere

# 2025-10-18
-Consistent Social Media Icon and About Section

-in adminPanel, program section, add programs, one more field for skills. then in /programs dynamic skill section

-Mentor Dashboard :Dark theme fix

-Student dasboard section: skill badges UI

-Company Dashboard :Dark theme fix,Under filter student contact button fix

-Student Dashboard:When the student is logged in(In place of Learner the name of student displayed)

-Dashboard:Homepage boys image borders round

-Homepage: image animation

# 2025-10-24
-Dashboard About and social media icon, Admin Panel :Add Student working

-What we offer section updation

-AdminPanel:Sidebar,Student section delete(server error) resolve

-AdminPanel:Total courses card that will show total courses

-dashboard:skillbadges, The badges of the candidate logged in shown 

-Admin Panel:Programs:Tags visible in dashboard

-Company Dashboard: Mentored Students Verified Badges(Cards data fetched from database)

-About:The top image similar to the rest pics in the page 

-Home Page: Replace the old logo with new logo

# 2025-10-25
-Company Dashboard:Test all fuctionality as user ,route protection 

-Company:Edit Profile:Must be working

-Dashboard:Testing all functionality,Company Dashboard :Dark theme fix

-Admin Panel :All tags,testing the functionality 

-mentor Dashboard :Test the functionality

-Route protection 

-Homepage and contact page :Test the fuctionality

-programs and about :test the fuctionality

-Homepage:Herosection :Change middle pic with that uptoskills offer

# 2025-10-27
-Home Page :Uptoskills Logo Fix

-Company Page :Sitting boy image changed

# 2025-10-28
-Contact Page:Send us message :fix failed to fetch

-Admin Panel:Sidebar, courses removed, comment out programs from the programs section

-Company Dashboard: Upcoming interview: Create a new table for interview and when the company log in it will show with the upcoming interview

-Testimonial :Give Review :color change

-Contact Page:when hover the send us message button the color should change to color green similar in logo

# 2025-10-29
-Dashboard:Project Submission Form Fix

-Programs:when the program is being loaded gif inplace of loading should display

-UI enhancement feature 

-Home:3rd image should be change and represent  uptoskill keeping design same ,Dashboard:userprofile :presentable ui

-Testemonial:Review side color should be changed,Dashboard:user profile when sidebar closed profile section should be in centre,footer

# 2025-10-30
-program join table

-Dashboard:Project Submission Form Fix

-programs enroll now loader

-company, profile icon footer sticks to bottom of page

-company, footer and about us scale full width

-adminPanel, platform overview all card same line

# 2025-10-31
-Dark theme fix

-Fix the alignment in the student dashboard

-Check the route protection

-Company Page :About us section colors must be changed to orange color, our contact remove linkedin,remove decscription

-About Page :fix the movement of all pic in herosection

# 2025-11-01
-Dark theme fix in the admin panel

-Role Based :route Protection

-About us :seperate div for about section and our contact page

# 2025-11-03
-Admin Panel: Mentors, Add Eye icon and by clicking it their details will be displayed

-Admin Panel: Students, Add an eye icon and show their details like project and comments and related information of student 

-Uptoskills logo must take to the home page of the uptoskills

-Home :Send us message and give review section must have the green color as in logo

-Admin Panel:Add the section of testimonials in sidebar ,in dashboard

-About: Image change

# 2025-11-04
-Add a searchbar in mentor section in admin panel

-Make An eye icon in Company section for viewing details 

-Database:Create a username field for username currently to be put as null  It is to be created for all roles

-Route protection role based

-Dashboard:SideBar, add My programs section

-User Login and register : user name section  added,In login page : user can login by its username or email

# 2025-11-05
-Research on how the notification will be working 

-Admin panel: Add a searchbar in company page

-Admin Panel :Testimonial Backend 

-Make the list of unnessecary file present in the project

-Company : Edit Profile : Footer must be scale

-Home Page :Trusted companies color must be shown when hover over them

# 2025-11-06
-Admin Panel :Mentor : Add a search Bar and mentors can be fetched by their name expertise 

-Admin panel:Add a searchbar in project page

-Home Page :All three pictures will have the animation style of middle pic

-Create the backend for the student who have enrolled in the courses

-Company :edit profile :footer color ,search candidate :make footer

-My programs new page

# 2025-11-07
-The deactivate button in UI for student in adminPanel

-A forgot password? in login page UI

# 2025-11-10
-Testmonial connected to backend in admin panel

-To check whether how the user can register with his username

-create a page where user can create its new password when forgotten

-deactivate button working and connected to backend research

-Change the icons of testimonials in admin panel, Total courses card data appears

# 2025-11-11
-Dashboard:Skill badges earned card connect with backend too

-Admin :Companies,mentor check why the data is not loading ,Stick the footer to the bottom

-Add chatbot to programs page

-Admin Panel Total student backend

# 2025-11-12
-replace the name courses with programs

-home:contact footer(light),admin:footer(dark/light)

-company : Check why the cards are not working properly (issue)

-student dashboard:your progress:258+ Tasks Completed(dynamically)

-adminpanel:programs, update image dynamically

-company:notification icon beside dark icon

-Mentor dashboard:notification icon beside drak icon,admin:student delete server check the issue

-Dashboard :Notification icon beside dark theme toggle

-adminpanel:ui adjustment,mentor:skillsbadges,addbages

# 2025-11-13
-Add forign keys in the database scripts

-Fix the dark theme in Home page, admin panel  dark theme 

-Forget Password :Prepare the backend

-programs: all the images of the courses must be displayed

-Login :When the user login the alert msg should not display in place of this popup for successful login be displayed 

-Register :When the user register the alert msg should not display in place of this popup for successful register be displayed ,Do the documentation for admin panel

-Research how we can make the notification work

# 2025-11-14
-Admin Panel: Project : Add section All programs below search bar 

-Admin Panel : Adjust the eye icon , Register :User name field must be above the name field

-Contact : description changed under our contact section

-Home : Change the middle picture , Change the favicon image 

-about page: the 'give review' button rounded corner.

-Research on notification work

-Company :Search Candidate :Comment out the filter student section

# 2025-11-15
-Research how the documentation of the project is done what does it include etc.

-Dashboard: In place of attendance card the courses you enrolled will be shown 

-Admin Panel: Remove the static programs from the programs section

-Change the third image in the home page

# 2025-11-17
-Remove the add student button in project section in admin panel

-Program:Enroll Now button at the bottom of the div , Register: Change the image

-Admin Panel:Make notification working

-Change the  middle image and add courses like cyber security etc

-making notification work

-AdminPanel:Sidebar :Under mentor section create programs assigned to mentors

# 2025-11-19
-Company: Schedule new interview :Suggestion of the candidate must shown

-Mentor Dashboard:About us :remove linked in ,and the para below our contact

-Dashboard:About us :remove linked in ,and the para below our contact

-Company : Check why student is not appearing when they are searched

-Dashboard :My programs, Remove add new program button

-Mentor Dashboard :Skill Badges as soon as the name of candidate is suggsted drop down must close

# 2025-11-20
-check if, /company and /Company are 2 different urls and both are working? If yes, then only the /company urlshould be working. and add username section in login page

-dashbord:mycourses(show program enroll from home page)

-Studentdashbord:editprofile(adjustment of sidebar)

-mentor:profileicon(make as working)

-company:profileicon(make if load profile)

-admin can assign a program name to a mentor name

# 2025-11-21
-Admin Panel : Cards to be in the same line ,Login page : remove space b/w login button and forgot password

-Mentor Dashboard: Projects : Rename to programs , the programs that are assigned to mentor will be shown(Frontend)

-Dashboard : In place Reward point  skill badges earned

-Make docs for route protection 

-Add chatbot to the Programs page

-Forgot Password: When the user type the password in 2nd field it should match with 1st field .

-Login Page:Div

-Mentor Dashboard: When the profile is completed the profile completed must be yes

-Company :Edit Profile

# 2025-11-22
-mentor Dashboard : Dark theme fix

-Dashboard : When the cards are loading there should 

-Forgot Password :Write username in para and placeholder

-Login Page : div  should be as in register page 

-Company : Search candidate : remove rating ,location remove static data 

-Admin Panel :Backend for Deactivating an account

# 2025-11-24
-Project Showcase Page must be working in mentor dashboard

-mentor:projects:show(Project Title&Total Students),contact vidyashree

-admin: Total Courses replace to total program

-solve admin login error

-home:to show chatbot in program page

-loginpage:user(unique) and mail-id(unique)

-company:intermidiate(remove static)

-mentor:projectshowcase issue fix

# 2025-11-25
-dashboard:my program:remove button

-comany:hiring overview(remove static)

-student:notification

-dashboad:my project

-dashboard:open button action

-home:program, form add username(check with logged or not)

# 2025-11-26
-Student dashboard: Dark theme issue resolve

-Previous Task backend , collaborate with Mohan for the same

-shift that your progress task to hiring overview

-Login : Make  the neccesary changes 

# 2025-11-27
-Documentation of the  programs ,Chatbot 

-Login Page :Forgot password fix

-documention of the adminpanel

-documention of the company

-documention of the mentordashboard

-Documentation of contact page , Dark Theme of mentor dashboard

-documention of the studentdashboard

-notification task

-program :add chatbot,about page testimonial section

# 2025-11-28
-Login and Register page documentation

-Admin Panel : Back button of all programs must be working , search bar in students must be working , Forgot Password Documentation 

-Test the functionality as mentor 

-Test the functionality as company ,About Page Documentation 

-Test the fuctionality of admin panel and whole website as admin

-Company : About us : footer must be fixed , add the footer in the interview page

-test the functionalities as student whole website

# 2025-11-29
-AdminPanel:Project, Search Bar ,Database add forign key

-Admin Panel:Project :The students that have been assigned the task must be also visible

-Admin Panel : Search Bar in the company page must be working

-Admin Panel : Assign Program: the dropdown must contain username

-Mentor Page :Dark theme collaborate with samruddhi

-Dashboard:My project : remove para no assigned project yet

-Login :Make the page responsive as register page,Dark theme task

-Programs : Generate the images of the programs

-Fix the footer in company panel

-Admin Panel : Student :Fix the delete button

-Project Showcase in student dashboard

-Dashboard: interview schedule card

# 2025-12-01
-Company Page stick the footer to the bottom , the email must be in the lowercase , username must be unique

-Admin Panel : Deletion of the testimonial would be not just in ui but also in database , student:the content in the card must not overflow from the card

-Mentor Dashboard: When the page refreshed dark theme must be same not removed ,remove project section

-Crop the newlogin image from the top and use that ,Admin Panel:Student remove the attendance card , Programs : tags must be written seperate as in last line 

-Add all the programs with images

-Dashboard: the username name is not fetched in user profile fix it ,fix the about us page

# 2025-12-02
-Company Profile page : Info of company must be in the centre, documentation

-Remove the images from upload folder that are not used anymore

-Mentor:Student : Only the students data must be shown , the arrow button should also be in the centre

-student detail fetch 

-Dashboard : My project : remove view details , project showcase : Remove the para when there is no project 

-Login :Make the page responsive as register page

-Mentor Dashboard:Profile page issue name should not have numbers

-company test

# 2025-12-03
-Dashboard : dark theme 

-Assests : logo/and photo's : keep one of the both logo

# 2025-12-04
-Documentation

-Login : when the user is logging in the loader in loading button must appear

-eye icon in admin panel

-Make the boxs instead of alerts everywhere in website

-Dark theme implemented on the whole website as in the official website , collab

# 2025-12-05
-Check the functionality of whole website

-Check the route protection is working properly

-Upload image and logo in place of the old version of doing this switch to new version 

-Admin Panel : Make cards in mentor similar to the student and company

-Login Page image : Create a more clear and replace it with old one

-Dark theme all over the website 

-Company : sidebar: remove the line 

# 2025-12-06
-in adminpanel, company there is that 0 hires in each company card remove that and replace with email of each company and remove any static data in the eye icon of company card.

-Dark theme in company page sidebar

-Dark theme in mentor page in admin panel

-collab on route protection 

# 2025-12-08
-Add the necessary comments in all files of Pages folder

-Make the png and remove the background of the logo(UPTOSKILLS)

-Admin Panel: Add social media icon in sidebar

-Add the necessary comments in all files of  admin folder

-Add the necessary comments in all files of student folder

-Dark theme implemented on the previous task

-Previous task , Add the necessary comments in all files of mentor folder

-Dark theme mentor dashboard and forgot password

-Add the necessary comments in all files of company folder

# 2025-12-09
-mentor programs tab target change

-mentor dashboard profile icon, Company interview footer

-mentor dashboard support dashboard

-adminpanel project fetch, confirm boxes

-Mentor dashboard files support comments

-Dark Theme handling in company page

# 2025-12-10
-favicon issue resolve

-mentor- dashboard UI checking.

-company profile username and logo fetch

-login page image enhancement

-admin panel project search bar, Add projects in student dashboard fix

-logo size handling

-Program login to apply

-Student Dashboard UI checking.

-Skill badge awarding fix

# 2025-12-11
-student card overflow 

-company logo and username

-mentor footer consistent 

-back button done

-project search bar admin panel.

-comments in mentor conflict issue, new logo use

-course dropdown remove

-student skill badge header change

-admin dashboard UI

# 2025-12-12
-axios fetching in student dashboard

-company dashboard axios fetching 

-mentor profile footer

-routes folder axios check

-admin panel axios fetching, dynamic total projects 

-mentor dashboard axios fetching

-Controller axios fetching

# 2025-12-13
-Responsiveness of the Frontend 

-Fix the image dimension in login page

-Make the logo in about , contact page as in home page, Company : Border in the logo must be removed , Admin Panel : The logo size same as other pages

-Name of all the files and folders must be in the camel case 

