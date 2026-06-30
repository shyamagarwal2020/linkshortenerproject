---
name: 'Create Instruction File'
description: 'Generate a new /docs instruction file for a specific coding domain in this project. Use when adding standards for a new layer of the stack (e.g., server actions, API routes, forms, testing).'
argument-hint: "Domain to document, e.g. 'server actions' or 'forms'"
agent: 'Instruction Generator'
---

Take the information below and generate an agent instructions .md file for it in the 'docs directory. If a .md filename is provided, use that, otherwise generate an appropriate filename based on the generated content. Make sure the instructions are concise and not too long. Make sure to update the AGENTS.md file to reference this new docs file. If not information is provided below, prompt the user to give the necessary details about the layer of architecture or coding standards to document.
