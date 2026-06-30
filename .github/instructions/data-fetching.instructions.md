---
description: Read this file to how to fetch data in the project.
--- 
# Data Fetching quidelines
This document outlines the best practices and quidelines for fetching data in out Next.js appliation. Adhering to these quidelines will ensure consistency, performance, and maintainability across the codebase.

## 1. Use Server components for Data Fetching

In Next.js, ALWAYS using Server components for data fetching. NEVER use Client Components to fetch data. 

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in the components.

All helper functions in the /data directory should use Drizzle ORM for database instructions.



