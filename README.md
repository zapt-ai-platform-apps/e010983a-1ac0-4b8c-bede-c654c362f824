# New App

## Overview

New App is a Social Dining & Lifestyle Platform that enhances group dining experiences by combining social networking, event planning, real-time coordination, and automated bill splitting. It caters to both users and restaurant partners, simplifying event coordination, reservations, payments, and creating lasting memories through shared photos and videos.

## User Journeys

### 1. User Registration and Profile Setup

1. **Sign Up**: Users can register using their phone number or link social media accounts (Facebook, Instagram).
2. **Add Friends**: Import contacts from phone, Facebook, Instagram, or WhatsApp to connect with friends already on the app.
3. **Set Preferences**:
   - **Dietary Preferences**: Indicate preferences like vegetarian or non-vegetarian.
   - **Alcohol Preferences**: Specify if they consume alcohol.
4. **Link Payment Method**: Add a debit or credit card to set up the in-app wallet with auto-refill functionality.
5. **Privacy Settings**: Configure location sharing and profile visibility options.

### 2. Planning and Reserving an Event

1. **Create an Event**: Select a partner restaurant within the app.
2. **Reserve a Table**: Choose date, time, and number of guests; a unique Event ID is generated.
3. **Invite Friends**: Select friends to invite; they receive notifications to confirm or decline.
4. **Customize Event**: Optionally add a custom menu, share posts, photos, and videos related to the event.

### 3. Real-Time Coordination During Event

1. **Location Sharing**: Attendees who opt-in can share their real-time location during the event.
2. **Arrival Notifications**: Users receive notifications when friends arrive at the venue.
3. **In-App Interaction**: Share and tag photos or videos, creating a live memory stream of the event.

### 4. Automated Bill Splitting and Payment Processing

1. **Bill Generation**: At meal's end, the restaurant issues a digital bill viewable in-app.
2. **Automatic Splitting**:
   - **By Dietary Preference**: Costs for vegetarian and non-vegetarian items are split based on user preferences.
   - **Alcohol Consumption**: Alcohol costs are shared only among users who consume alcohol.
3. **Adjustments for No-Shows**: If confirmed attendees don't show up, the bill is recalculated among present members.
4. **Payment Processing**:
   - **Auto-Deduction**: Each user's share is deducted from their in-app wallet.
   - **Wallet Refill**: If the wallet balance is low, it auto-refills from the linked payment method.
5. **Receipts**: Each user receives a digital receipt detailing their contributions.

### 5. Post-Event Memories and Sharing

1. **Event Memories**: Access the event timeline to view shared photos and videos.
2. **Tagging Friends**: Tag friends in posts, which appear in their timelines.
3. **External Sharing**: Option to share select memories on external social media platforms.

### 6. Restaurant Interaction (For Partners)

1. **Dashboard Access**: Restaurants can log in to view reservations and Event IDs.
2. **Menu Uploads**: Upload event-specific menus or promotions.
3. **Confirm Reservations**: Manage and confirm upcoming reservations.
4. **Payment Confirmation**: Receive immediate payment summaries post-event.

## External APIs and Services Used

- **Supabase**: Used for user authentication and real-time database functionalities.
- **Location Services API**: For real-time location tracking of users during events.
- **Payment Gateway API**: Securely process payments and manage user wallets.

## Notes

- **Privacy Focused**: Users have full control over their data sharing and privacy settings.
- **Seamless Experience**: The app eliminates the hassle of coordinating events and splitting bills manually.
- **Interactive Platform**: Enhances social interactions and creates lasting memories tied to each dining experience.
