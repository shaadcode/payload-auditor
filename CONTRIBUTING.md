# Contributing to Payload Auditor

👋 Thank you for your interest in contributing to **Payload Auditor**!
Your contributions help make this plugin more useful, secure, and stable for the Payload CMS community.

---

## 🧩 Development Setup

To develop, you need to follow these steps:

- Click the **Fork** button on GitHub to create your own copy.

- Clone your fork locally

```bash
git clone https://github.com/<your-username>/payload-auditor.git
cd payload-auditor
```

* Install dependencies

```bash
npm install
```

* Connect to the main repo(Just once): This is very important. To get the latest changes, you must run the following command

```bash
git remote add upstream https://github.com/shaadcode/payload-auditor.git
```

> You only need to run this command once after each clone.

* Create a Branch

To develop, you need to create a branch. Note that the branch name must include the following three parts:

```bash
type/the-purpose-of-the-branch
```

for example:

```bash
doc/combined-afterhook-logs
```

* Get the latest changes: Before you commit, you need to get the latest changes from the main code. This step is very important because it will make your changes get into the main repo faster. Run the following command:

```bash
npm run sync-main:fork
```

* Write code & commit using Conventional Commits

To commit, you must run the `commit` script as follows:

```bash
npm run commit
```

By executing this command, an environment for writing commits will be created for you, in the following order:

1. Commit type: What is the purpose of your current code that you are about to commit?

2. commit scope: You need to specify which area of the plugin your code is for.If you cannot select an item, select the empty option.

3. commit message

4. description(optional): Please provide more details about your commit

5. breaking change(optional): If your changes result in breaking changes, you can list them.

6. close issue: Do not enter anything in this section
* Open a Pull Request: Open a PR to the main branch and enter an appropriate name and description.

---

## 🧪Plugin testing environment

You can test your changes locally in the same repo.

```bash
cd dev
npm run dev
```

---

## 🧠 Commit Message Format (Conventional Commits)

Examples:

```bash
feat: add audit log cleanup scheduler
fix: handle missing user object in afterChange hook
docs: update plugin usage section
chore: bump dependency versions
```

---

## 📬 Contact

If you have any questions or want to discuss an idea before coding:

- Open a [Discussion](https://github.com/shaadcode/payload-auditor/discussions)

- Or create an [Issue](https://github.com/shaadcode/payload-auditor/issues)

---

Thank you again for helping improve **Payload Auditor** ❤
