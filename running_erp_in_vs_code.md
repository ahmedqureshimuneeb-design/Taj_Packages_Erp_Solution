# How to Run Taj Packages ERP Locally in VS Code

Follow these simple steps to run your single-file React application locally on your computer using Visual Studio Code and Node.js.

## Prerequisites
Make sure you have **Node.js** installed on your computer (downloadable from [nodejs.org](https://nodejs.org/)).

---

## Step-by-Step Instructions

### Step 1: Create a Project Folder
1. Open VS Code.
2. Create a new empty folder on your computer (for example, name it `taj-packages-erp`).
3. In VS Code, go to **File > Open Folder...** and select your newly created folder.

### Step 2: Initialize a Vite + React Project
Open the integrated terminal in VS Code (**Terminal > New Terminal** or `Ctrl + \`` / `Cmd + \``) and run the following command to set up a lightweight React template:

```bash
npm create vite@latest . -- --template react-ts
```
*(If prompted to overwrite or install packages, press `y` or `Enter` to confirm).*

### Step 3: Install Dependencies
In the same terminal, install the required project dependencies and Lucide icons:

```bash
npm install
npm install lucide-react
```

### Step 4: Replace `App.tsx`
1. In the VS Code file explorer on the left, navigate to the `src` folder.
2. Open the file named `App.tsx`.
3. Select all existing code in `App.tsx` and delete it.
4. Copy the complete code from your **Taj Packages ERP** artifact and paste it into `src/App.tsx`, then save the file (`Ctrl + S` or `Cmd + S`).

### Step 5: Start the Local Development Server
In your terminal, run the local development server command:

```bash
npm run dev
```

### Step 6: View in Browser
Once running, VS Code will display a local URL in the terminal (usually `http://localhost:5173`). 
* **Ctrl + Click** (or **Cmd + Click**) on that link to open your fully interactive ERP application in your web browser!

---

## Why Local Data Persistence Works Here:
Unlike Google Sites sandboxed iframes (which clear memory on refresh), running this locally on `localhost` allows full access to browser `localStorage` and IndexedDB. Every raw material, custom variable, product, or cost calculation you save will persist permanently across future sessions and browser reloads!