🧠 Your final CampVista permission structure

I'd suggest starting with this:

Feature	User	Hotel	Admin
Browse campgrounds	✅	✅	✅
View campground	✅	✅	✅
Book campground	✅	❌	❌
Create campground	❌	✅	✅
Edit own campground	❌	✅	✅
Delete own campground	❌	✅	✅
Edit others' campground	❌	❌	✅
Delete others' campground	❌	❌	✅
Admin dashboard	❌	❌	✅
Manage users	❌	❌	✅




CampVista/
│
├── models/
│   ├── campground.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── campgrounds.js
│   ├── reviews.js
│   ├── users.js
│   ├── admin.js
│   └── hotels.js
│
├── middleware/
│   ├── auth.js
│   ├── role.js
│   └── ownership.js
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── campgrounds/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── new.ejs
│   │   └── edit.ejs
│   │
│   ├── users/
│   │   ├── login.ejs
│   │   └── register.ejs
│   │
│   ├── hotels/
│   │   └── dashboard.ejs
│   │
│   ├── admin/
│   │   └── dashboard.ejs
│   │
│   └── error.ejs
│
├── public/
│   ├── stylesheets/
│   │   └── app.css
│   ├── javascripts/
│   │   └── app.js
│   └── images/
│
├── seeds/
│   ├── index.js
│   └── seedHelpers.js
│
├── utils/
│   ├── ExpressError.js
│   └── catchAsync.js
│
├── app.js
├── middleware.js
├── schemas.js
├── package.json
├── package-lock.json
└── .env