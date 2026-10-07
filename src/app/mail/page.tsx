"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Inbox,
  Send,
  Star,
  Trash2,
  RefreshCw,
  Search,
  PenSquare,
  Mail,
  ArrowLeft,
  Reply,
  Forward,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  getMailData,
  sendEmailAction,
  markMessageReadAction,
  toggleStarAction,
  deleteMessageAction,
} from "./actions";
import { TEAM_ACCOUNTS, type MailboxAccount } from "@/lib/mail/service";
import type { MailFolder } from "@prisma/client";

interface MailItem {
  id: string;
  createdAt: Date | string;
  mailbox: string;
  direction: "INBOUND" | "OUTBOUND";
  folder: MailFolder;
  from: string;
  to: string;
  cc?: string | null;
  subject: string;
  bodyText?: string | null;
  bodyHtml?: string | null;
  snippet?: string | null;
  isRead: boolean;
  isStarred: boolean;
}

export default function MailAppPage() {
  const [currentMailbox, setCurrentMailbox] = useState<string>("kombasteve@ies.engineer");
  const [currentFolder, setCurrentFolder] = useState<MailFolder>("INBOX");
  const [filterStarred, setFilterStarred] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<MailItem[]>([]);
  const [counts, setCounts] = useState({
    unreadInbox: 0,
    inbox: 0,
    sent: 0,
    starred: 0,
    trash: 0,
  });
  const [selectedMessage, setSelectedMessage] = useState<MailItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Compose State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeFrom, setComposeFrom] = useState<string>("kombasteve@ies.engineer");
  const [composeTo, setComposeTo] = useState("");
  const [composeCc, setComposeCc] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeError, setComposeError] = useState("");
  const [composeSuccess, setComposeSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Load Messages
  const loadMessages = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await getMailData(currentMailbox, currentFolder, searchQuery);
      let list = (data.messages || []) as unknown as MailItem[];
      if (filterStarred) {
        list = list.filter((m) => m.isStarred);
      }
      setMessages(list);
      setCounts(data.counts);

      // Auto-select first message on desktop if none selected
      if (list.length > 0 && !selectedMessage) {
        setSelectedMessage(list[0]);
      } else if (selectedMessage) {
        // Keep selected message updated if still in list
        const updated = list.find((m) => m.id === selectedMessage.id);
        if (updated) setSelectedMessage(updated);
      }
    } catch (err) {
      console.error("Failed to load mail:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [currentMailbox, currentFolder, searchQuery, filterStarred, selectedMessage]);

  useEffect(() => {
    loadMessages();
  }, [currentMailbox, currentFolder, filterStarred, searchQuery, loadMessages]);

  // Handle Select Message
  const handleSelectMessage = async (msg: MailItem) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
      setCounts((prev) => ({
        ...prev,
        unreadInbox: Math.max(0, prev.unreadInbox - 1),
      }));
      await markMessageReadAction(msg.id, true);
    }
  };

  // Toggle Star
  const handleToggleStar = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m))
    );
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, isStarred: !prev.isStarred } : null));
    }
    await toggleStarAction(id);
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    await deleteMessageAction(id);
  };

  // Open Compose
  const handleOpenCompose = (prefill?: { to?: string; subject?: string; body?: string }) => {
    setComposeFrom(currentMailbox);
    setComposeTo(prefill?.to || "");
    setComposeCc("");
    setComposeSubject(prefill?.subject || "");
    setComposeBody(prefill?.body || "");
    setComposeError("");
    setComposeSuccess(false);
    setIsComposeOpen(true);
  };

  // Quick Reply
  const handleReply = () => {
    if (!selectedMessage) return;
    const toAddress = selectedMessage.direction === "INBOUND" ? selectedMessage.from : selectedMessage.to;
    // Extract email from "Name <email>" if present
    const cleanTo = toAddress.replace(/.*<([^>]+)>.*/, "$1").trim();
    const sub = selectedMessage.subject.startsWith("Re:")
      ? selectedMessage.subject
      : `Re: ${selectedMessage.subject}`;
    const quoted = `\n\n--- On ${new Date(selectedMessage.createdAt).toLocaleString()}, ${selectedMessage.from} wrote:\n> ${selectedMessage.bodyText || ""}`;
    handleOpenCompose({ to: cleanTo, subject: sub, body: quoted });
  };

  // Send Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim()) {
      setComposeError("Please specify a recipient email address.");
      return;
    }
    setComposeError("");
    setIsSending(true);

    try {
      // First try standard REST API endpoint /api/mail/send
      const response = await fetch("/api/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mailbox: composeFrom,
          to: composeTo,
          cc: composeCc || undefined,
          subject: composeSubject,
          bodyText: composeBody,
        }),
      });

      const res = await response.json();

      if (!res.success) {
        setComposeError(res.error || "Failed to send email.");
        setIsSending(false);
        return;
      }

      setComposeSuccess(true);
      setTimeout(() => {
        setIsComposeOpen(false);
        setComposeSuccess(false);
        setIsSending(false);
        loadMessages();
      }, 1000);
    } catch {
      // Fallback to server action if direct fetch encountered network issue
      try {
        const res = await sendEmailAction({
          mailbox: composeFrom,
          to: composeTo,
          cc: composeCc || undefined,
          subject: composeSubject,
          bodyText: composeBody,
        });

        if (!res.success) {
          setComposeError(res.error || "Failed to send email.");
          setIsSending(false);
          return;
        }

        setComposeSuccess(true);
        setTimeout(() => {
          setIsComposeOpen(false);
          setComposeSuccess(false);
          setIsSending(false);
          loadMessages();
        }, 1000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to send email.";
        setComposeError(msg);
        setIsSending(false);
      }
    }
  };

  const currentAccount = TEAM_ACCOUNTS.find((a) => a.email === currentMailbox) || TEAM_ACCOUNTS[0];

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#08170F]">
      {/* Top Navigation Bar */}
      <header className="flex h-16 w-full items-center justify-between border-b border-[#163A28] bg-[#0E2318] px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/brand/logo.png"
              alt="Impact Energy Solution"
              width={130}
              height={40}
              className="h-8 w-auto"
            />
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#163A28] px-2.5 py-0.5 text-xs font-semibold text-[#F2B705] border border-[#F2B705]/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              mail.ies.engineer
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FBE98F]/50" />
            <input
              type="text"
              placeholder="Search messages, senders, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#163A28] bg-[#163A28]/60 py-2 pl-10 pr-4 text-xs text-[#FBE98F] placeholder-[#FBE98F]/40 focus:border-[#F2B705] focus:outline-none focus:ring-1 focus:ring-[#F2B705]"
            />
          </div>
        </div>

        {/* Account Selector Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadMessages()}
            title="Refresh mailbox"
            className="rounded-lg p-2 text-[#FBE98F]/70 hover:bg-[#163A28] hover:text-[#F2B705] transition"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#F2B705]" : ""}`} />
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 rounded-xl bg-[#163A28] px-3 py-1.5 border border-[#F2B705]/30 text-left hover:border-[#F2B705] transition">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2E7D4F] font-bold text-xs text-[#FBE98F]">
                {currentAccount.avatar}
              </div>
              <div className="hidden md:block leading-tight pr-1">
                <div className="text-xs font-semibold text-[#FBE98F]">{currentAccount.name}</div>
                <div className="text-[10px] text-[#FBE98F]/60 truncate max-w-[150px]">{currentAccount.email}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#FBE98F]/60" />
            </button>

            {/* Account Switcher Menu */}
            <div className="absolute right-0 top-full mt-2 hidden w-64 rounded-xl border border-[#163A28] bg-[#0E2318] p-2 shadow-2xl group-hover:block z-50">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#F2B705]/80 border-b border-[#163A28]">
                Switch Team Mailbox
              </div>
              <div className="mt-1 space-y-1">
                {TEAM_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => {
                      setCurrentMailbox(acc.email);
                      setSelectedMessage(null);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      currentMailbox === acc.email
                        ? "bg-[#2E7D4F] text-[#FBE98F] font-bold"
                        : "text-[#FBE98F]/80 hover:bg-[#163A28] hover:text-[#F2B705]"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#163A28] text-[10px] font-bold text-[#F2B705]">
                      {acc.avatar}
                    </span>
                    <div className="flex-1 truncate">
                      <div className="truncate">{acc.name}</div>
                      <div className="text-[10px] opacity-70 truncate">{acc.email}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-[#163A28] px-2 flex justify-between items-center text-[11px] text-[#FBE98F]/60">
                <Link href="/admin/inquiries" className="hover:text-[#F2B705] flex items-center gap-1">
                  Admin Dashboard <ExternalLink className="h-3 w-3" />
                </Link>
                <Link href="/" className="hover:text-[#F2B705]">
                  Public Site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Mail Layout: Sidebar + Message List + Message Details */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 shrink-0 border-r border-[#163A28] bg-[#08170F] p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-4">
            {/* Compose Button */}
            <button
              onClick={() => handleOpenCompose()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F2B705] py-2.5 px-4 font-bold text-xs text-[#08170F] shadow-lg hover:bg-[#FFE066] transition active:scale-95"
            >
              <PenSquare className="h-4 w-4" />
              New Message
            </button>

            {/* Folder Navigation */}
            <nav className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setCurrentFolder("INBOX");
                  setFilterStarred(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition font-medium ${
                  currentFolder === "INBOX" && !filterStarred
                    ? "bg-[#163A28] text-[#F2B705] font-bold"
                    : "text-[#FBE98F]/70 hover:bg-[#163A28]/50 hover:text-[#FBE98F]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="h-4 w-4" />
                  <span>Inbox</span>
                </div>
                {counts.unreadInbox > 0 && (
                  <span className="rounded-full bg-[#F2B705] px-2 py-0.5 text-[10px] font-bold text-[#08170F]">
                    {counts.unreadInbox}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setFilterStarred(true);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition font-medium ${
                  filterStarred
                    ? "bg-[#163A28] text-[#F2B705] font-bold"
                    : "text-[#FBE98F]/70 hover:bg-[#163A28]/50 hover:text-[#FBE98F]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="h-4 w-4 text-[#F2B705]" />
                  <span>Starred</span>
                </div>
                {counts.starred > 0 && (
                  <span className="text-[11px] text-[#FBE98F]/60">{counts.starred}</span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentFolder("SENT");
                  setFilterStarred(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition font-medium ${
                  currentFolder === "SENT" && !filterStarred
                    ? "bg-[#163A28] text-[#F2B705] font-bold"
                    : "text-[#FBE98F]/70 hover:bg-[#163A28]/50 hover:text-[#FBE98F]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send className="h-4 w-4" />
                  <span>Sent Messages</span>
                </div>
                <span className="text-[11px] text-[#FBE98F]/60">{counts.sent}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentFolder("TRASH");
                  setFilterStarred(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition font-medium ${
                  currentFolder === "TRASH" && !filterStarred
                    ? "bg-[#163A28] text-[#F2B705] font-bold"
                    : "text-[#FBE98F]/70 hover:bg-[#163A28]/50 hover:text-[#FBE98F]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="h-4 w-4" />
                  <span>Trash</span>
                </div>
                <span className="text-[11px] text-[#FBE98F]/60">{counts.trash}</span>
              </button>
            </nav>
          </div>

          {/* Mailbox Status Card */}
          <div className="rounded-xl border border-[#163A28] bg-[#0E2318] p-3 text-[11px] text-[#FBE98F]/70">
            <div className="font-bold text-[#F2B705] mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Live Domain
            </div>
            <div className="truncate">{currentMailbox}</div>
            <div className="mt-2 text-[10px] text-[#FBE98F]/50">
              Connected via Resend & ies.engineer
            </div>
          </div>
        </aside>

        {/* Message List Column */}
        <section
          className={`w-full md:w-80 lg:w-96 shrink-0 border-r border-[#163A28] bg-[#0E2318] flex flex-col ${
            selectedMessage ? "hidden md:flex" : "flex"
          }`}
        >
          {/* List Header & Controls */}
          <div className="flex items-center justify-between border-b border-[#163A28] px-4 py-3 bg-[#08170F]/50">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F2B705]">
              {filterStarred ? "Starred" : currentFolder} ({messages.length})
            </div>
            <button
              onClick={() => handleOpenCompose()}
              className="md:hidden rounded-lg bg-[#F2B705] p-2 text-[#08170F]"
              title="Compose"
            >
              <PenSquare className="h-4 w-4" />
            </button>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#163A28]">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#FBE98F]/50">
                <Mail className="mx-auto h-8 w-8 mb-2 opacity-30" />
                No messages found in this folder.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`group relative flex cursor-pointer flex-col gap-1 p-3.5 transition ${
                    selectedMessage?.id === msg.id
                      ? "bg-[#163A28] border-l-4 border-l-[#F2B705]"
                      : "hover:bg-[#163A28]/40"
                  } ${!msg.isRead ? "font-bold text-[#FBE98F]" : "text-[#FBE98F]/75"}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate pr-2 font-semibold text-[#F2B705]">
                      {msg.direction === "OUTBOUND" ? `To: ${msg.to}` : msg.from}
                    </span>
                    <span className="text-[10px] text-[#FBE98F]/40 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="text-xs truncate font-medium text-[#FBE98F]">
                    {msg.subject || "(No Subject)"}
                  </div>

                  <div className="text-[11px] text-[#FBE98F]/50 truncate font-normal">
                    {msg.snippet || msg.bodyText || "No preview"}
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <button
                      onClick={(e) => handleToggleStar(e, msg.id)}
                      className="p-1 hover:text-[#F2B705]"
                      title={msg.isStarred ? "Starred" : "Not starred"}
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${
                          msg.isStarred ? "fill-[#F2B705] text-[#F2B705]" : "text-[#FBE98F]/30"
                        }`}
                      />
                    </button>
                    {!msg.isRead && (
                      <span className="h-2 w-2 rounded-full bg-[#F2B705]" title="Unread" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Message Detail Reading Pane */}
        <main
          className={`flex-1 flex-col overflow-y-auto bg-[#08170F] ${
            selectedMessage ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Message Header Toolbar */}
              <div className="flex items-center justify-between border-b border-[#163A28] bg-[#0E2318] px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="md:hidden rounded-lg p-1.5 text-[#FBE98F]/70 hover:bg-[#163A28]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReply()}
                    className="flex items-center gap-1.5 rounded-lg bg-[#2E7D4F] px-3 py-1.5 text-xs font-bold text-[#FBE98F] hover:bg-[#2E7D4F]/80 transition"
                  >
                    <Reply className="h-3.5 w-3.5" /> Reply
                  </button>
                  <button
                    onClick={() => {
                      const fwdSub = `Fwd: ${selectedMessage.subject}`;
                      const fwdBody = `\n\n---------- Forwarded message ---------\nFrom: ${selectedMessage.from}\nDate: ${new Date(selectedMessage.createdAt).toLocaleString()}\nSubject: ${selectedMessage.subject}\nTo: ${selectedMessage.to}\n\n${selectedMessage.bodyText || ""}`;
                      handleOpenCompose({ subject: fwdSub, body: fwdBody });
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-[#163A28] bg-[#163A28] px-3 py-1.5 text-xs text-[#FBE98F] hover:border-[#F2B705] transition"
                  >
                    <Forward className="h-3.5 w-3.5" /> Forward
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleStar(e, selectedMessage.id)}
                    className="rounded-lg p-2 text-[#FBE98F]/70 hover:bg-[#163A28] transition"
                    title="Star message"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        selectedMessage.isStarred
                          ? "fill-[#F2B705] text-[#F2B705]"
                          : "text-[#FBE98F]/40"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-[#163A28] transition"
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Message Details */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div>
                  <h1 className="font-fraunces text-xl font-bold text-[#FBE98F] mb-4">
                    {selectedMessage.subject || "(No Subject)"}
                  </h1>

                  <div className="flex items-start justify-between rounded-xl bg-[#0E2318] p-4 border border-[#163A28]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E7D4F] font-bold text-sm text-[#FBE98F]">
                        {selectedMessage.from.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#F2B705]">
                          {selectedMessage.from}
                        </div>
                        <div className="text-xs text-[#FBE98F]/60">
                          To: {selectedMessage.to}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#FBE98F]/50">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="rounded-xl border border-[#163A28] bg-[#0E2318]/50 p-6 text-sm text-[#FBE98F] leading-relaxed">
                  {selectedMessage.bodyHtml ? (
                    <div
                      className="prose prose-invert max-w-none text-xs sm:text-sm"
                      dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {selectedMessage.bodyText || "No content."}
                    </div>
                  )}
                </div>

                {/* Quick Reply Box */}
                <div className="rounded-xl border border-[#163A28] bg-[#0E2318] p-4">
                  <div className="text-xs font-semibold text-[#F2B705] mb-2">
                    Quick Reply from {currentMailbox}
                  </div>
                  <button
                    onClick={() => handleReply()}
                    className="w-full text-left rounded-xl border border-[#163A28] bg-[#08170F] p-3 text-xs text-[#FBE98F]/50 hover:border-[#F2B705] hover:text-[#FBE98F] transition"
                  >
                    Click to reply to {selectedMessage.from}...
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-xs text-[#FBE98F]/40">
              <Mail className="h-16 w-16 mb-4 text-[#163A28]" />
              <div className="text-sm font-semibold text-[#FBE98F]/60">No message selected</div>
              <div className="mt-1">Choose a conversation from the list or compose a new email.</div>
              <button
                onClick={() => handleOpenCompose()}
                className="mt-4 rounded-xl bg-[#2E7D4F] px-4 py-2 font-bold text-xs text-[#FBE98F] hover:bg-[#2E7D4F]/80 transition"
              >
                Compose Message
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Compose Email Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-[#163A28] bg-[#0E2318] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#163A28] bg-[#08170F] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <PenSquare className="h-4 w-4 text-[#F2B705]" />
                <span className="text-xs font-bold text-[#FBE98F]">New Message (mail.ies.engineer)</span>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="rounded-lg p-1 text-[#FBE98F]/60 hover:bg-[#163A28] hover:text-[#FBE98F]"
              >
                &times;
              </button>
            </div>

            {/* Compose Form */}
            <form onSubmit={handleSendEmail} className="flex flex-1 flex-col p-5 space-y-3.5 overflow-y-auto">
              {composeError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-800/80 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{composeError}</span>
                </div>
              )}

              {composeSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-green-950/60 border border-green-800/80 p-3 text-xs text-green-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                  <span>Message sent successfully!</span>
                </div>
              )}

              {/* From Mailbox Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-[#F2B705] mb-1">From Account</label>
                <select
                  value={composeFrom}
                  onChange={(e) => setComposeFrom(e.target.value)}
                  className="w-full rounded-xl border border-[#163A28] bg-[#08170F] px-3 py-2 text-xs text-[#FBE98F] focus:border-[#F2B705] focus:outline-none"
                >
                  {TEAM_ACCOUNTS.map((acc) => (
                    <option key={acc.email} value={acc.email} className="bg-[#08170F] text-[#FBE98F]">
                      {acc.name} &lt;{acc.email}&gt;
                    </option>
                  ))}
                </select>
              </div>

              {/* To Address */}
              <div>
                <label className="block text-[11px] font-semibold text-[#F2B705] mb-1">To</label>
                <input
                  type="email"
                  required
                  placeholder="recipient@example.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full rounded-xl border border-[#163A28] bg-[#08170F] px-3 py-2 text-xs text-[#FBE98F] placeholder-[#FBE98F]/30 focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              {/* CC Address */}
              <div>
                <label className="block text-[11px] font-semibold text-[#FBE98F]/60 mb-1">CC (Optional)</label>
                <input
                  type="text"
                  placeholder="Optional CC recipients"
                  value={composeCc}
                  onChange={(e) => setComposeCc(e.target.value)}
                  className="w-full rounded-xl border border-[#163A28] bg-[#08170F] px-3 py-2 text-xs text-[#FBE98F] placeholder-[#FBE98F]/30 focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-semibold text-[#F2B705] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Subject of the email"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full rounded-xl border border-[#163A28] bg-[#08170F] px-3 py-2 text-xs text-[#FBE98F] placeholder-[#FBE98F]/30 focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col">
                <label className="block text-[11px] font-semibold text-[#F2B705] mb-1">Message Body</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write your email message here..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full flex-1 rounded-xl border border-[#163A28] bg-[#08170F] p-3 text-xs text-[#FBE98F] placeholder-[#FBE98F]/30 focus:border-[#F2B705] focus:outline-none font-sans leading-relaxed"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#163A28]">
                <div className="text-[10px] text-[#FBE98F]/50">
                  Sending via Resend API &bull; {composeFrom}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="rounded-xl border border-[#163A28] px-4 py-2 text-xs font-semibold text-[#FBE98F]/70 hover:bg-[#163A28]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex items-center gap-1.5 rounded-xl bg-[#F2B705] px-5 py-2 text-xs font-bold text-[#08170F] hover:bg-[#FFE066] transition disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
