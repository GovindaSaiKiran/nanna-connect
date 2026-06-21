# 👨‍👦 Nanna Connect

## AI-Powered Multilingual Elderly Assistance Platform

Nanna Connect is a voice-first, multilingual, accessibility-focused mobile web application designed to help elderly users interact with technology easily using their native language.

The project was built for the **#BuildForDad Challenge** with the goal of reducing the technology gap between elderly users and modern smartphones.

Instead of navigating complex menus and applications, users can perform important daily tasks using simple voice commands and large accessibility-friendly interfaces.

---

# 🎯 Problem Statement

Many elderly people struggle with:

* Complex smartphone interfaces
* Small buttons and text
* Language barriers
* Managing medicines
* Calling family members quickly
* Emergency situations
* Remembering important information
* Using modern applications

Nanna Connect solves these challenges through voice assistance, multilingual support, and simplified workflows.

---

# 🌟 Key Features

## 🤖 Nanna AI Assistant

A voice-powered intelligent assistant that allows elderly users to interact with the application naturally.

### Supported Actions

* Call contacts
* Call family members by relationship
* Open medicines
* Open SOS
* Open emergency contacts
* Open calculator
* Open notes
* Share location
* General assistance

### Example Commands

Telugu:

```text
నా కొడుకుకు కాల్ చేయి
```

Hindi:

```text
मेरे बेटे को कॉल करो
```

English:

```text
Call my son
```

---

# 👨‍👩‍👧‍👦 Relationship-Based Calling

Instead of remembering phone numbers or names, users can save relationships.

Examples:

* Son
* Daughter
* Mother
* Father
* Brother
* Sister
* Doctor
* Friend
* Wife
* Husband

Example:

```text
Call my son
```

↓

Automatically finds:

```text
Govinda Sai Kiran
```

↓

Initiates call

---

# 🌍 Multilingual Support

Supported Languages:

* English
* Telugu
* Hindi
* Tamil
* Kannada
* Malayalam

Features:

* UI Translation
* Voice Commands
* Voice Guidance
* Relationship Recognition
* Contact Search

---

# 📞 Smart Contact Management

### Features

* Add Contact
* Edit Contact
* Delete Contact
* Soft Delete Protection
* Local Name Support
* Relationship Mapping

Example:

```text
Name:
Govinda

Local Name:
గోవింద

Relationship:
Son
```

---

# 🔍 Intelligent Contact Recognition

Nanna Connect can find contacts using:

### Relationship Matching

```text
Call my son
```

### English Name Matching

```text
Call Govinda
```

### Local Language Matching

```text
గోవింద కి కాల్ చేయి
```

### Transliteration Matching

```text
गोविंदा को कॉल करो
```

### Fuzzy Matching

Handles minor speech recognition mistakes and pronunciation variations.

---

# 💊 Medicine Reminder System

Elderly-friendly medicine management.

### Features

* Add Medicine
* Edit Medicine
* Delete Medicine
* Morning Reminder
* Afternoon Reminder
* Night Reminder
* Medicine History
* Voice Guidance

---

# 🚨 SOS Emergency System

One-tap emergency access.

### Features

* Emergency Screen
* Emergency Contacts
* Quick Access Interface
* Elderly-Friendly Buttons

---

# 📍 Location Sharing

Allows users to share their current location quickly.

### Features

* Location Detection
* Quick Share Interface
* Emergency Use Cases

---

# 📝 Quick Notes

Simple note-taking system.

### Features

* Create Notes
* Edit Notes
* Delete Notes
* Voice Note Support

---

# 🧮 Accessibility Calculator

Large-button calculator designed for elderly users.

### Features

* Large UI
* Simple Layout
* Voice Guidance
* Multilingual Support

---

# 🔊 Voice Guidance System

Designed specifically for elderly users.

### Features

* Button Feedback
* Action Confirmation
* Multilingual Speech
* Voice Guidance Toggle

Example:

```text
Medicine Saved
```

```text
Emergency Contact Added
```

```text
Location Shared
```

---

# 🧠 AI Architecture

Nanna Connect uses a hybrid architecture.

## Local Processing First

The application first tries:

### Relationship Engine

Detects:

```text
Call my son
```

### Contact Resolution Engine

Detects:

```text
Call Govinda
```

### Local Command Engine

Detects:

```text
Open SOS
```

### Local Math Engine

Handles calculations.

---

## Gemini AI Fallback

If local engines cannot understand the request:

```text
User Command
↓
Intent Router
↓
Gemini AI
↓
Response
```

This reduces cost and improves performance.

---

# 🏗️ Technical Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### AI

* Google Gemini API

### Voice

* Web Speech API
* Speech Recognition
* Speech Synthesis

### Storage

* LocalStorage

### Deployment

* Vercel

---

# ♿ Accessibility Features

Designed specifically for elderly users.

### Accessibility Enhancements

* Large Buttons
* Large Fonts
* High Contrast
* Voice Guidance
* Minimal Navigation
* One Task Per Screen
* Native Language Support

---

# ⚠️ Current Limitations

Due to browser limitations and project scope, some advanced features are not fully optimized.

## Speech Recognition

Speech recognition quality depends on:

* Browser support
* Device microphone quality
* Internet connection
* Language availability on device

## WhatsApp Integration

The application cannot directly send WhatsApp messages automatically because:

* WhatsApp does not provide unrestricted public APIs for this use case.
* Browser security restrictions prevent automatic message sending.

Instead:

* Contacts can be called directly.
* Location can be shared through supported browser mechanisms.

## Offline Limitations

Works offline for:

* Contacts
* Notes
* Calculator
* Medicine Data
* Emergency Contacts

Requires internet for:

* Gemini AI Assistant
* Advanced AI responses
* Cloud-based processing

---

# 🔒 Security

* API Keys are never hardcoded.
* Gemini API is isolated through server-side functions.
* Environment variables are used for deployment.
* Sensitive data is not exposed to clients.

---

# 🚀 Future Improvements

### Planned Features

* WhatsApp Business Integration
* Voice Translation Between Languages
* Doctor Appointment Management
* Family Dashboard
* Health Monitoring
* Medication OCR Scanner
* Emergency SMS Automation
* AI Health Coach
* Offline AI Models
* Family Notification System

---

# 👨‍💻 Developer

**TANINKI GOVINDA SAI KIRAN**

Built with the vision of helping parents and elderly people use technology independently.

---

# ❤️ Built For Dad

Technology should adapt to people.

People should not be forced to adapt to technology.

Nanna Connect was created to make smartphones simpler, safer, and more accessible for elderly users through voice, language, and intelligent assistance.
