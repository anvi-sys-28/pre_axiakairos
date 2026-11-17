import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/faq-2-utils/accordion";
import {
  SupportContactCard,
  type SupportAvatar,
} from "@/components/ui/faq-2-utils/support-contact-card";
import { cn } from "@/lib/utils";

export type FAQItem = {
  value: string;
  question: string;
  answer: string;
};

// FAQs grouped by category; each category renders its own Accordion section.
export type FAQCategory = {
  title: string;
  items: FAQItem[];
};

export const faqCategories: FAQCategory[] = [
  {
    title: "Account & Collaboration",
    items: [
      {
        value: "account",
        question: "How do I create an account?",
        answer:
          "You can sign up using your email address or a supported social login. Once registered, your workspace will be created automatically and you can start adding pages immediately.",
      },
      {
        value: "collaboration",
        question: "Can I collaborate with my team in real time?",
        answer:
          "Yes, multiple users can edit the same page simultaneously. Changes are synced instantly, and you can leave comments, mention teammates, and track updates in real time.",
      },
      {
        value: "offline",
        question: "Does the app work offline?",
        answer:
          "You can view and edit recently opened pages without an internet connection. Your changes will automatically sync once you reconnect.",
      },
    ],
  },
  {
    title: "Security & Data",
    items: [
      {
        value: "security",
        question: "How is my data secured?",
        answer:
          "All data is encrypted in transit and at rest. We follow industry-standard security practices and regularly perform backups to ensure your content is protected.",
      },
      {
        value: "storage",
        question: "Is there a storage limit?",
        answer:
          "Free plans include a limited storage quota, while paid plans offer higher or unlimited storage depending on the subscription tier.",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        value: "billing",
        question: "How does billing work?",
        answer:
          "Billing is based on your selected plan and the number of active users in your workspace. You can upgrade, downgrade, or cancel your subscription at any time from the billing settings.",
      },
    ],
  },
];

// Support team avatars; `className` z-indexes control their overlap order in AvatarGroup.
export const supportAvatars: ReadonlyArray<SupportAvatar> = [
  {
    src: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTA4MCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPiAgICAgICAgPGRlZnM+ICAgIDxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iLTIwJSIgeT0iLTIwJSIgd2lkdGg9IjE0MCUiIGhlaWdodD0iMTQwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBwcmltaXRpdmVVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ibGluZWFyUkdCIj4gICAgICA8ZmVNb3JwaG9sb2d5IG9wZXJhdG9yPSJkaWxhdGUiIHJhZGl1cz0iMjAgMjAiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJtb3JwaG9sb2d5Ii8+ICAgICAgPGZlRmxvb2QgZmxvb2QtY29sb3I9IiNmZmZmZmYiIGZsb29kLW9wYWNpdHk9IjEiIHJlc3VsdD0iZmxvb2QiLz4gICAgICA8ZmVDb21wb3NpdGUgaW49ImZsb29kIiBpbjI9Im1vcnBob2xvZ3kiIG9wZXJhdG9yPSJpbiIgcmVzdWx0PSJjb21wb3NpdGUiLz4gICAgICA8ZmVNZXJnZSByZXN1bHQ9Im1lcmdlIj4gICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49ImNvbXBvc2l0ZSIgcmVzdWx0PSJtZXJnZU5vZGUiLz4gICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIgcmVzdWx0PSJtZXJnZU5vZGUxIi8+ICAgICAgICA8L2ZlTWVyZ2U+ICAgIDwvZmlsdGVyPiAgPC9kZWZzPiAgICAgICAgPGcgaWQ9Im5vdGlvbi1hdmF0YXIiIGZpbHRlcj0idXJsKCNmaWx0ZXIpIj4gICAgICAgICAgPGcgaWQ9Im5vdGlvbi1hdmF0YXItZmFjZSIgZmlsbD0iI2ZmZmZmZiI+ICAgICAgICAgICAgPHRpdGxlPkZhY2UvIDk8L3RpdGxlPiAgICA8ZyBpZD0iRmFjZS8tOSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4gICAgICAgIDxwYXRoIGQ9Ik01MzIsMzc5IEM2NjQuNTQ4MzQsMzc5IDc3Miw0ODYuNDUxNjYgNzcyLDYxOSBDNzcyLDc1MS41NDgzNCA3MDQuNTQ4MzQsOTE5IDU5Miw5MTkgQzUwNi42ODMxNzQsOTE5IDM3OC4zMjQzNjcsODIyLjc3NjYxMSAzMjEuMjA1MTIxLDcxOC40NzU0NDMgQzMxOC4xODg3MzYsNzE4LjgyMTk0OCAzMTUuMTE1MTYxLDcxOSAzMTIsNzE5IEMyNjcuODE3MjIsNzE5IDIzMiw2ODMuMTgyNzggMjMyLDYzOSBDMjMyLDU5OS4xMzQ5NTYgMjYxLjE1ODg0Myw1NjYuMDgwMzI1IDI5OS4zMTIwODYsNTYwLjAwMDU1IEMzMjUuNTk5Mjk3LDQ1NS45NzkyMTMgNDE5LjgwOTkxOSwzNzkgNTMyLDM3OSBaIE0yOTUuODU4ODk1LDYyNC41NDUxODcgTDMwNC4xNDExMDUsNjU1LjQ1NDgxMyIgaWQ9IlBhdGgiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyNCIvPiAgICA8L2c+ICAgICAgPC9nPjxnIGlkPSJub3Rpb24tYXZhdGFyLW5vc2UiPiAgICAgICAgICAgIDx0aXRsZT5Ob3NlLyAyPC90aXRsZT4gICAgPGcgaWQ9Ik5vc2UvLTIiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+ICAgICAgICA8cGF0aCBkPSJNNjkyLjg5MzIzMiw2MjcuNzI1MDMzIEM2NzMuNjI3ODc5LDYzOS44NTUwNzQgNjU5LjIzNjYyMyw2NDcuMjYzNDk4IDY0OS43MTk0NjMsNjQ5Ljk1MDMwNiBDNjQwLjIwMjMwMyw2NTIuNjM3MTE0IDYyNS43MjIwMzYsNjUzLjM3OTQ2NSA2MDYuMjc4NjYzLDY1Mi4xNzczNjEiIGlkPSJMaW5lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0OS41ODU5NDgsIDY0MC4yMjk4ODUpIHJvdGF0ZSgtODkuMjM0OTkzKSB0cmFuc2xhdGUoLTY0OS41ODU5NDgsIC02NDAuMjI5ODg1KSAiLz4gICAgPC9nPiAgICAgIDwvZz48ZyBpZD0ibm90aW9uLWF2YXRhci1tb3V0aCI+ICAgICAgICAgICAgPHRpdGxlPk1vdXRoLyAxMDwvdGl0bGU+ICAgIDxnIGlkPSJNb3V0aC8tMTAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+ICAgICAgICA8cGF0aCBkPSJNNTQ5LDc1OSBDNTc2LjMzMDM4LDc2NS42NjY2NjcgNTk5LjY2MzcxNCw3NjkgNjE5LDc2OSBDNjM4LjMzNjI4Niw3NjkgNjU1LjAwMjk1Myw3NjUuNjY2NjY3IDY2OSw3NTkgQzY1Ni4zMzAzOCw3OTIuMzMzMzMzIDYzMi45OTcwNDcsODA5IDU5OSw4MDkgQzU2NS4wMDI5NTMsODA5IDU0OC4zMzYyODYsNzkyLjMzMzMzMyA1NDksNzU5IFoiIGlkPSJQYXRoIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMTYiLz4gICAgPC9nPiAgICAgIDwvZz48ZyBpZD0ibm90aW9uLWF2YXRhci1leWVzIj4gICAgICAgIDxnIGlkPSJFeWVzLyAxMiI+PGcgaWQ9Ikdyb3VwIDIiPjxwYXRoIGlkPSJQYXRoIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTUzNCA1MjguMTU2QzUzNCA1MjguMTU2IDU2Mi41NjkgNTU0LjQzOCA1ODYuMTY5IDU0OS45MDdDNjA5Ljc2OSA1NDUuMzc1IDU5OS44MzIgNTIwIDU5OS44MzIgNTIwQzU5OS44MzIgNTIwIDYxNC43MzggNTQ2LjI4MiA1OTMuNjIyIDU1NC40MzhDNTcyLjUwNiA1NjIuNTk1IDUzNCA1MjguMTU2IDUzNCA1MjguMTU2WiIgZmlsbD0iYmxhY2siIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4gICAgPC9nPjwvZz4gICAgICA8L2c+PGcgaWQ9Im5vdGlvbi1hdmF0YXItZXllYnJvd3MiPiAgICAgICAgICAgIDx0aXRsZT5FeWVicm93cy8gMDwvdGl0bGU+ICAgIDxnIGlkPSJFeWVicm93cy8tMCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4gICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTI1LjAwMDAwMCwgNDkyLjAwMDAwMCkiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxNiI+ICAgICAgICAgICAgPHBhdGggZD0iTTAsMTYgQzEyLjg4ODg4ODksNS4zMzMzMzMzMyAyNy44ODg4ODg5LDAgNDUsMCBDNjIuMTExMTExMSwwIDc3LjExMTExMTEsNS4zMzMzMzMzMyA5MCwxNiIgaWQ9IlBhdGgiLz4gICAgICAgICAgICA8cGF0aCBkPSJNMTM4LDE2IEMxNTAuODg4ODg5LDUuMzMzMzMzMzMgMTY1Ljg4ODg4OSwwIDE4MywwIEMyMDAuMTExMTExLDAgMjE1LjExMTExMSw1LjMzMzMzMzMzIDIyOCwxNiIgaWQ9IlBhdGgiLz4gICAgICAgIDwvZz4gICAgPC9nPiAgICAgIDwvZz48ZyBpZD0ibm90aW9uLWF2YXRhci1nbGFzc2VzIj4gICAgICAgICAgICA8dGl0bGU+R2xhc3Nlcy8gOTwvdGl0bGU+ICAgIDxnIGlkPSJHbGFzc2VzLy05IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPiAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODkuMDAwMDAwLCA0NjYuMDAwMDAwKSIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjQiPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMjkuMTQ5MjU1LDUuMjEwMzcyNjggQzI0Ny42NzIxNTQsMTAuMDA1OTI0IDI4My4yNjEwMjEsMjYuNjEzNzA5MyAzMjQuNjkwMzQzLDQzLjE1MjY1MTIgTDMyNS40NjQ0ODEsNDMuNDU1ODExMiBDMzMxLjExNzY4LDQ1LjYyODI5NTcgMzM5LjAzMjc2NSw0Ny43OTcyOTMyIDM0OS4yMDk3MzcsNDkuOTYyODAzNyBMMzQ5LjIwOTczNyw3MS4zNjYxNDAzIEMzNDQuMTYxOTU0LDc0LjQ3MzA3NzQgMzQxLjA2MTgwMSw3Ny4zOTE3MTQyIDMzOS45MDkyNzcsODAuMTIyMDUwNyBDMzI1LjUzNTgzOSwxMTQuMTcyODEzIDI5OC40Nzk5NTYsMTM2LjU0OTAyOSAyNTcuMDUwNjM0LDEyNC44NzQ0ODIgQzIwMC43NjcyOTcsMTA5LjAxNDE1NyAxODEuODAxNDU5LDI1LjY0MDgzMDMgMTgwLjExMDQ2NiwxMi4wMjA1MjUyIEMxNzguNDE5NDc0LC0xLjU5OTc3OTg3IDE5Ni4yMDUyMjEsLTMuMzE4Nzg5MjUgMjI5LjE0OTI1NSw1LjIxMDM3MjY4IFogTTQ3MC44NTA3NDUsNS4yMTAzNzI2OCBMNDcyLjgwOTE2Myw0LjcxMDkzNCBDNTA0LjQ5ODQxOSwtMy4yNDUyNjgzNiA1MjEuNTQ2NzA3LC0xLjMyNzM3Mzc3IDUxOS44ODk1MzQsMTIuMDIwNTI1MiBDNTE4LjE5ODU0MSwyNS42NDA4MzAzIDQ5OS4yMzI3MDMsMTA5LjAxNDE1NyA0NDIuOTQ5MzY2LDEyNC44NzQ0ODIgQzQwMS41MjAwNDQsMTM2LjU0OTAyOSAzNzQuNDY0MTYxLDExNC4xNzI4MTMgMzYwLjA5MDcyMyw4MC4xMjIwNTA3IEMzNTguOTY5MzQ4LDc3LjQ2NTUwNzEgMzU2LjAwNDE5OSw3NC42MzA3MDQgMzUxLjE5NTI3NSw3MS42MTc2NDE1IEwzNTAuNzkwMjYzLDcxLjM2NjE0MDMgTDM1MC43OTAyNjMsNDkuOTYyODAzNyBMMzUyLjE5NTYyNiw0OS42NjA2MTY4IEMzNjIuMTYyMTksNDcuNDk0NzgxOSAzNjkuODY2ODY3LDQ1LjMyNTQ2MDEgMzc1LjMwOTY1Nyw0My4xNTI2NTEyIEwzNzcuNzg4MzE4LDQyLjE2MDMyNzEgQzQxOC4xNTU3MDcsMjUuOTU0MTIyNyA0NTIuNjk4MzA0LDkuOTEwMDEyOTggNDcwLjg1MDc0NSw1LjIxMDM3MjY4IFoiIGlkPSJDb21iaW5lZC1TaGFwZSIvPiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjE5OSA0MyA0IDc1IDAgODQgMTk5IDY0Ii8+ICAgICAgICA8L2c+ICAgIDwvZz4gICAgICA8L2c+PGcgaWQ9Im5vdGlvbi1hdmF0YXItaGFpciI+ICAgICAgICA8ZyBpZD0iSGFpcnN0eWxlLyAzMCI+ICAgIDxnIGlkPSJIYWlyc3R5bGUvLTMwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPiAgICAgICAgPHBhdGggZD0iTTEzOCwxNiBDMTUwLjg4ODg4OSw1LjMzMzMzMzMzIDE2NS44ODg4ODksMCAxODMsMCBDMjAwLjExMTExMSwwIDIxNS4xMTExMTEsNS4zMzMzMzMzMyAyMjgsMTYiIGlkPSJQYXRoIi8+ICAgICAgICA8L2c+ICAgIDwvZz4gICAgICA8L2c+ICAgICAgICA8L2c+ICAgICAgICA8L3N2Zz4=",
    alt: "@u1",
    fallback: "A1",
    className: "z-1",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/a6/a64de3d165dd0972c52549668fd3a1f6aca428a4eba06e7a48dc1d4b18abe369.png",
    alt: "@ri0n_dev",
    fallback: "RI",
    className: "z-2",
  },
  {
    src: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTA4MCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPiAgICAgICAgPGRlZnM+ICAgIDxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iLTIwJSIgeT0iLTIwJSIgd2lkdGg9IjE0MCUiIGhlaWdodD0iMTQwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBwcmltaXRpdmVVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ibGluZWFyUkdCIj4gICAgICA8ZmVNb3JwaG9sb2d5IG9wZXJhdG9yPSJkaWxhdGUiIHJhZGl1cz0iMjAgMjAiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJtb3JwaG9sb2d5Ii8+ICAgICAgPGZlRmxvb2QgZmxvb2QtY29sb3I9IiNmZmZmZmYiIGZsb29kLW9wYWNpdHk9IjEiIHJlc3VsdD0iZmxvb2QiLz4gICAgICA8ZmVDb21wb3NpdGUgaW49ImZsb29kIiBpbjI9Im1vcnBob2xvZ3kiIG9wZXJhdG9yPSJpbiIgcmVzdWx0PSJjb21wb3NpdGUiLz4gICAgICA8ZmVNZXJnZSByZXN1bHQ9Im1lcmdlIj4gICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49ImNvbXBvc2l0ZSIgcmVzdWx0PSJtZXJnZU5vZGUiLz4gICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIgcmVzdWx0PSJtZXJnZU5vZGUxIi8+ICAgICAgICA8L2ZlTWVyZ2U+ICAgIDwvZmlsdGVyPiAgPC9kZWZzPiAgICAgICAgPGcgaWQ9Im5vdGlvbi1hdmF0YXIiIGZpbHRlcj0idXJsKCNmaWx0ZXIpIj4gICAgICAgICAgPGcgaWQ9Im5vdGlvbi1hdmF0YXItZmFjZSIgZmlsbD0iI2ZmZmZmZiI+ICAgICAgICAgICAgPHRpdGxlPkZhY2UvIDE8L3RpdGxlPiAgICA8ZyBpZD0iRmFjZS8tMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4gICAgICAgIDxwYXRoIGQ9Ik01MzIsMzc5IEM2NjQuNTQ4MzQsMzc5IDc3Miw0ODYuNDUxNjYgNzcyLDYxOSBDNzcyLDc1MS41NDgzNCA2NjQuNTQ4MzQsODc5IDUzMiw4NzkgQzQzNS4xMzI2Myw4NzkgMzUxLjY2ODg5OCw4MDEuNjEyMjAyIDMxMy43NTI3NzUsNzE4Ljk4MDU3NSBMMzEzLjMyMjk0Niw3MTguOTg5MjgyIEwzMTIsNzE5IEMyNjcuODE3MjIsNzE5IDIzMiw2ODMuMTgyNzggMjMyLDYzOSBDMjMyLDU5OS4xMzQ5NTYgMjYxLjE1ODg0Myw1NjYuMDgwMzI1IDI5OS4zMTIwODYsNTYwLjAwMDU1IEMzMjUuNTk5Mjk3LDQ1NS45NzkyMTMgNDE5LjgwOTkxOSwzNzkgNTMyLDM3OSBaIE0yOTUuODU4ODk1LDYyNC41NDUxODcgTDMwNC4xNDExMDUsNjU1LjQ1NDgxMyIgaWQ9IlBhdGgiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyNCIvPiAgICA8L2c+ICAgICAgPC9nPjxnIGlkPSJub3Rpb24tYXZhdGFyLW5vc2UiPiAgICAgICAgICAgIDx0aXRsZT5Ob3NlLyAwPC90aXRsZT4gICAgPGcgaWQ9Ik5vc2UvLTAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+ICAgICAgICA8bGluZSB4MT0iNjM3IiB5MT0iNTk2IiB4Mj0iNjYxLjg1NjE4OSIgeTI9IjY4Mi40OTk1MzciIGlkPSJMaW5lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0OS40MjgwOTQsIDYzOS4yNDk3NjgpIHJvdGF0ZSgxLjAzMjMzOSkgdHJhbnNsYXRlKC02NDkuNDI4MDk0LCAtNjM5LjI0OTc2OCkgIi8+ICAgIDwvZz4gICAgICA8L2c+PGcgaWQ9Im5vdGlvbi1hdmF0YXItbW91dGgiPiAgICAgICAgICAgIDx0aXRsZT5Nb3V0aC8gODwvdGl0bGU+ICAgIDxnIGlkPSJNb3V0aC8tOCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4gICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTE4LjAwMDAwMCwgNzI5LjAwMDAwMCkiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxNiI+ICAgICAgICAgICAgPHBhdGggZD0iTS0zLjY5NDgyMjIzZS0xMyw0MC4yOTA2MDM4IEMxMS4xNTEzODU4LDM3LjI1MjE5NjQgMTkuMTUxMzg1OCwzNC41ODgwMzIgMjQsMzIuMjk4MTEwNiBDMjguODQ4NjE0MiwzMC4wMDgxODkxIDM1Ljk4OTI1MTYsMjUuODM2NTMzMiA0NS40MjE5MTIzLDE5Ljc4MzE0MjcgQzYyLjQzMDk1NjgsOC45ODI2NDM1MiA3My42MjM2NTI2LDIuOTgyMDM1MzIgNzksMS43ODEzMTgxNCBDODQuMzc2MzQ3NCwwLjU4MDYwMDk2NSA5MS4zNzYzNDc0LDIuNTE4MTc1MDkgMTAwLDcuNTk0MDQwNTEgQzExMiwtMS4xMjUwNDMwNCAxMjMsLTIuMzM2MDI2ODYgMTMzLDMuOTYxMDg5MDMgQzE0MywxMC4yNTgyMDQ5IDE0NS4zMzMzMzMsMjAuNDMwNDY5MSAxNDAsMzQuNDc3ODgxNCBDMTQ1LjMzMzMzMyw0MS4yNTkzOTA5IDE0NC42NjY2NjcsNDguMDQwOTAwMyAxMzgsNTQuODIyNDA5NyBDMTI4LDY0Ljk5NDY3MzggMTA3LDcyLjI2MDU3NjggNzksNjkuMzU0MjE1NiBDNjYuNjg5Mzk5Niw2OC4wNzYzOTI0IDUyLjM5OTY5ODMsNjIuODQxOTkyMSAzNCw1NC44MjI0MDk3IEMyNy42NjY3MjA5LDUyLjA2MjAyNDYgMTYuMzMzMzg3Niw0Ny4yMTgwODkzIC0zLjY5NDgyMjIzZS0xMyw0MC4yOTA2MDM4IFoiIGlkPSJQYXRoIi8+ICAgICAgICAgICAgPHBhdGggZD0iTTEyLDQzIEM1NC4yODI2NTc4LDM2LjM4OTA5OTEgODIuOTQ5MzI0NCwzMi43MjI0MzI0IDk4LDMyIEMxMTMuMDUwNjc2LDMxLjI3NzU2NzYgMTI2LjA1MDY3NiwzMi45NDQyMzQyIDEzNywzNyIgaWQ9IlBhdGgiLz4gICAgICAgIDwvZz4gICAgPC9nPiAgICAgIDwvZz48ZyBpZD0ibm90aW9uLWF2YXRhci1leWVzIj4gICAgICAgICAgICA8dGl0bGU+RXllcy8gMTwvdGl0bGU+ICAgIDxnIGlkPSJFeWVzLy0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTQ2LjAwMDAwMCwgNTA5LjAwMDAwMCkiPiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNCw3IEMzNy4yNTQ4MzQsNyA0OCwxNy43NDUxNjYgNDgsMzEgQzQ4LDQ0LjI1NDgzNCAzNy4yNTQ4MzQsNTUgMjQsNTUgQzEwLjc0NTE2Niw1NSAwLDQ0LjI1NDgzNCAwLDMxIEMwLDE3Ljc0NTE2NiAxMC43NDUxNjYsNyAyNCw3IFogTTE2Miw3IEMxNzUuMjU0ODM0LDcgMTg2LDE3Ljc0NTE2NiAxODYsMzEgQzE4Niw0NC4yNTQ4MzQgMTc1LjI1NDgzNCw1NSAxNjIsNTUgQzE0OC43NDUxNjYsNTUgMTM4LDQ0LjI1NDgzNCAxMzgsMzEgQzEzOCwxNy43NDUxNjYgMTQ4Ljc0NTE2Niw3IDE2Miw3IFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iIzAwMDAwMCIvPiAgICAgICAgICAgIDxnIGlkPSJQYXRoIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSI0Ij4gICAgICAgICAgICAgICAgPHBhdGggZD0iTTAsNyBDOCwyLjMzMzMzMzMzIDE2LDAgMjQsMCBDMzIsMCA0MCwyLjMzMzMzMzMzIDQ4LDciLz4gICAgICAgICAgICAgICAgPHBhdGggZD0iTTEzOCw3IEMxNDYsMi4zMzMzMzMzMyAxNTQsMCAxNjIsMCBDMTcwLDAgMTc4LDIuMzMzMzMzMzMgMTg2LDciLz4gICAgICAgICAgICA8L2c+ICAgICAgICA8L2c+ICAgIDwvZz4gICAgICA8L2c+ICAgICAgICA8L2c+ICAgICAgICA8L3N2Zz4=",
    alt: "@u2",
    fallback: "A4",
    className: "z-1",
  },
];

export interface FAQProps {
  categories?: FAQCategory[];
  supportAvatars?: ReadonlyArray<SupportAvatar>;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  isDark?: boolean;
}

export function FAQ({
  categories = faqCategories,
  supportAvatars: avatars = supportAvatars,
  eyebrow = "FAQ",
  title = "Your Questions Answered",
  description = "Need help with something? Here are some of the most common questions we get.",
  className = "",
  isDark: propIsDark,
}: FAQProps) {
  const [internalDark, setInternalDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  useEffect(() => {
    const update = () => {
      setInternalDark(document.documentElement.classList.contains("dark"));
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("themechange", update);
    return () => {
      obs.disconnect();
      window.removeEventListener("themechange", update);
    };
  }, []);

  const isDark = propIsDark !== undefined ? propIsDark : internalDark;

  return (
    <section className={cn("relative flex w-full justify-center py-16 transition-colors duration-300", isDark ? "text-white" : "text-[#0f172a]", className)}>
      <div className="flex w-full max-w-3xl flex-col items-center gap-10">
        <div className="flex flex-col gap-2 text-center">
          <p className={cn("text-pretty text-xs sm:text-sm font-mono uppercase tracking-widest font-semibold", isDark ? "text-emerald-400" : "text-[#0c7075]")}>
            {eyebrow}
          </p>
          <h1 className={cn("text-balance text-2xl font-bold tracking-tight md:text-3xl xl:text-4xl", isDark ? "text-white" : "text-[#0f172a]")}>
            {title}
          </h1>
          <p className={cn("mt-2 text-sm sm:text-base max-w-lg leading-relaxed", isDark ? "text-zinc-400" : "text-[#64748b]")}>
            {description}
          </p>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-8">
          {categories.map((category) => (
            <div key={category.title} className="flex flex-col gap-3">
              <h2 className={cn("text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold", isDark ? "text-emerald-400/90" : "text-[#0c7075]")}>
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item) => (
                  <AccordionItem
                    key={item.value}
                    value={item.value}
                    className={cn("border-b transition-colors", isDark ? "border-white/10" : "border-[#e2e8f0]")}
                  >
                    <AccordionTrigger
                      className={cn(
                        "md:text-base text-left font-medium hover:no-underline transition-colors",
                        isDark
                          ? "text-zinc-100 hover:text-emerald-400 [&[data-state=open]]:text-emerald-400"
                          : "text-[#0f172a] hover:text-[#0c7075] [&[data-state=open]]:text-[#0c7075]"
                      )}
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent
                      className={cn(
                        "md:text-base leading-relaxed font-normal",
                        isDark ? "text-zinc-300" : "text-[#475569]"
                      )}
                    >
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <SupportContactCard supportAvatars={avatars} isDark={isDark} />
      </div>
    </section>
  );
}

export default FAQ;
