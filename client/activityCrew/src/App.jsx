import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Auth
import { useAuth } from "./hooks/useAuth";
import LandingScreen           from "./components/auth/LandingScreen";
import SignInScreen             from "./components/auth/SignInScreen";
import SignUpScreen             from "./components/auth/SignUpScreen";
import ForgotPasswordScreen     from "./components/auth/ForgotPasswordScreen";
import EmailVerificationScreen  from "./components/auth/EmailVerificationScreen";

// Layout
import TopNav   from "./components/layout/TopNav";
import BottomNav from "./components/layout/BottomNav";
import TopBar    from "./components/layout/TopBar";
import ConnectionRequestsPanel from "./components/layout/ConnectionRequestsPanel";

// Screens
import FeedView          from "./components/feed/FeedView";
import ActivityDetail    from "./components/activity/ActivityDetail";
import ChatView          from "./components/chat/ChatView";
import MapView           from "./components/map/MapView";
import ProfileView       from "./components/profile/ProfileView";
import UserProfilePage   from "./components/profile/UserProfilePage";
import CreateActivity    from "./components/create/CreateActivity";
import DashboardView     from "./components/dashboard/DashboardView";
import NotificationsView from "./components/notifications/NotificationsView";
import PeopleNearbyView  from "./components/people/PeopleNearbyView";
import CalendarView      from "./components/calendar/CalendarView";

// UI
import Toast from "./components/ui/Toast";

// Hooks
import { useToast }         from "./hooks/useToast";
import { useActivities }    from "./hooks/useActivities";
import { useNotifications } from "./hooks/useNotifications";
import { useConnections }   from "./hooks/useConnections";

// ── Auth gate ─────────────────────────────────────────────────────────
export default function App() {
  const { isAuthenticated, authScreen, pendingEmail, signIn, signOut, goTo, AUTH_SCREENS: AS, user } = useAuth();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {!isAuthenticated ? (
        (() => {
          switch (authScreen) {
            case AS.SIGN_IN:
              return <SignInScreen
                onSuccess={signIn}
                onSignUp={() => goTo(AS.SIGN_UP)}
                onBack={() => goTo(AS.LANDING)}
                onForgotPassword={() => goTo(AS.FORGOT)}
              />;
            case AS.SIGN_UP:
              return <SignUpScreen
                onSuccess={(email) => signIn()}
                onSignIn={() => goTo(AS.SIGN_IN)}
                onBack={() => goTo(AS.LANDING)}
              />;
            case AS.FORGOT:
              return <ForgotPasswordScreen
                onBack={() => goTo(AS.SIGN_IN)}
                onSuccess={() => goTo(AS.SIGN_IN)}
              />;
            case AS.VERIFY_EMAIL:
              return <EmailVerificationScreen
                email={pendingEmail}
                onSuccess={signIn}
                onBack={() => goTo(AS.SIGN_UP)}
              />;
            default:
              return <LandingScreen
                onSignIn={() => goTo(AS.SIGN_IN)}
                onSignUp={() => goTo(AS.SIGN_UP)}
              />;
          }
        })()
      ) : (
        <AppShell onSignOut={signOut} user={user} />
      )}
    </GoogleOAuthProvider>
  );
}

// ── Authenticated shell ───────────────────────────────────────────────
function AppShell({ onSignOut, user }) {
  const [tab, setTab]                             = useState("home");
  const [selectedActivity, setSelectedActivity]   = useState(null);
  const [chatActivity, setChatActivity]           = useState(null);
  const [creating, setCreating]                   = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequests, setShowRequests]           = useState(false);
  const [showProfile, setShowProfile]             = useState(false);
  const [showPeople, setShowPeople]               = useState(false);
  const [showCalendar, setShowCalendar]           = useState(false);
  const [selectedUser, setSelectedUser]           = useState(null);
  const [isDesktop, setIsDesktop]                 = useState(window.innerWidth >= 768);

  const { activities, addActivity, joinActivity, joinedIds, hostedActivities, joinedActivities } = useActivities();
  const { message: toast, showToast }       = useToast();
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const { requests, accept, decline, requestCount }           = useConnections();

  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // ── Close all panels helper ───────────────────────────────────────
  const closeAll = () => {
    setShowNotifications(false);
    setShowRequests(false);
    setShowProfile(false);
    setShowPeople(false);
    setShowCalendar(false);
    setSelectedActivity(null);
    setChatActivity(null);
    setCreating(false);
    setSelectedUser(null);
  };

  // ── Handlers ─────────────────────────────────────────────────────
  const handleJoin    = (a) => { joinActivity(a.id); showToast(`✓ Joined ${a.title}`); };
  const handleCreate  = async (a) => { try { await addActivity(a); showToast("🎉 Activity created!"); setCreating(false); } catch { showToast("Failed to create activity"); } };
  const handleOpenActivity = (a) => { closeAll(); setSelectedActivity(a); };
  const handleOpenChat = () => { setChatActivity(selectedActivity); setSelectedActivity(null); };
  const handleSelectUser = (person) => { closeAll(); setSelectedUser(person); };

  const handleTabChange = (t) => { closeAll(); setTab(t); };
  const handleNotifications = () => { closeAll(); setShowNotifications(true); };
  const handleRequests      = () => { closeAll(); setShowRequests(true); };
  const handleProfile       = () => { closeAll(); setShowProfile(true); };
  const handlePeople        = () => { closeAll(); setShowPeople(true); };
  const handleCalendar      = () => { closeAll(); setShowCalendar(true); };
  const handleCreate_btn    = () => { closeAll(); setCreating(true); };

  const handleBack = () => {
    if (chatActivity)       { setChatActivity(null);       return; }
    if (creating)           { setCreating(false);          return; }
    if (selectedActivity)   { setSelectedActivity(null);   return; }
    if (selectedUser)       { setSelectedUser(null);       return; }
    if (showNotifications)  { setShowNotifications(false); return; }
    if (showRequests)       { setShowRequests(false);       return; }
    if (showProfile)        { setShowProfile(false);       return; }
    if (showPeople)         { setShowPeople(false);         return; }
    if (showCalendar)       { setShowCalendar(false);       return; }
  };

  // ── What's in the slide-over panel ────────────────────────────────
  const overlay = selectedActivity || chatActivity || showNotifications || showRequests || showProfile || showPeople || showCalendar || creating || selectedUser;

  // ── Main page content ─────────────────────────────────────────────
  const renderPage = () => {
    switch (tab) {
      case "map":  return <MapView activities={activities} />;
      case "home": return (
        <DashboardView
          user={user}
          onCreateClick={handleCreate_btn}
          activities={activities}
          onOpen={handleOpenActivity}
          onNavigate={(t) => {
            if (t === "people") handlePeople(); else if (t === "calendar") handleCalendar();
            else handleTabChange(t);
          }}
          onSelectPerson={handleSelectUser}
        />
      );
      default: return (
        <FeedView
          activities={activities}
          onJoin={handleJoin}
          onOpen={handleOpenActivity}
          onCreateClick={handleCreate_btn}
          joinedIds={joinedIds}
        />
      );
    }
  };

  // ── Slide panel content ───────────────────────────────────────────
  const renderPanel = () => {
    if (chatActivity) return (
      <ChatView activity={chatActivity} onBack={() => setChatActivity(null)} isJoined={joinedIds.has(chatActivity?.id)} />
    );
    if (selectedUser) return (
      <UserProfilePage
        userId={selectedUser.id}
        onBack={() => setSelectedUser(null)}
        onOpen={handleOpenActivity}
      />
    );
    if (selectedActivity) return (
      <ActivityDetail
        activity={selectedActivity}
        onBack={() => setSelectedActivity(null)}
        onChat={handleOpenChat}
        onJoin={handleJoin}
        isJoined={joinedIds.has(selectedActivity?.id)}
      />
    );
    if (creating) return (
      <CreateActivity onBack={() => setCreating(false)} onCreate={handleCreate} />
    );
    if (showNotifications) return (
      <NotificationsView
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
        onMarkRead={markRead}
        onBack={() => setShowNotifications(false)}
      />
    );
    if (showRequests) return (
      <ConnectionRequestsPanel
        requests={requests}
        onAccept={accept}
        onDecline={decline}
        onBack={() => setShowRequests(false)}
      />
    );
    if (showPeople) return (
      <PeopleNearbyView onBack={() => setShowPeople(false)} onSelectPerson={handleSelectUser} />
    );
    if (showCalendar) return (
      <CalendarView onBack={() => setShowCalendar(false)} />
    );
    if (showProfile) return (
      <ProfileView
        onLogout={() => { closeAll(); onSignOut(); }}
        onOpen={handleOpenActivity}
        hostedActivities={hostedActivities}
        joinedActivities={joinedActivities}
      />
    );
    return null;
  };

  // ── Shared nav props ──────────────────────────────────────────────
  const navProps = {
    activeTab: tab,
    onTabChange: handleTabChange,
    unreadCount,
    requestCount,
    onNotificationsClick: handleNotifications,
    onRequestsClick: handleRequests,
    onProfileClick: handleProfile,
    onLogout: () => { closeAll(); onSignOut(); },
    onCreateClick: handleCreate_btn,
    user, // pass real user data for avatar/initials in nav
  };

  // ── Panel width — desktop only ────────────────────────────────────
  const isFullScreenMode = showProfile || selectedUser;
  const PANEL_W = isFullScreenMode ? "100%" : "min(600px, 65%)";

  // ── DESKTOP ───────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <>
        <GlobalStyles />
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a0f", overflow: "hidden" }}>

          <TopNav {...navProps} />

          {/* Content area */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#0d0d12" }}>

            {/* Page — dims when panel open (but not in full screen mode) */}
            <div style={{
              height: "100%",
              transition: "filter 0.28s ease, transform 0.28s ease",
              filter:    (overlay && !isFullScreenMode) ? "blur(2px) brightness(0.5)" : "none",
              transform: (overlay && !isFullScreenMode) ? "scale(0.985)" : "scale(1)",
              pointerEvents: (overlay && !isFullScreenMode) ? "none" : "auto",
              willChange: "filter, transform",
            }}>
              {renderPage()}
            </div>

            {/* Backdrop */}
            {overlay && !isFullScreenMode && (
              <div
                onClick={handleBack}
                style={{ position: "absolute", inset: 0, zIndex: 10, cursor: "pointer" }}
              />
            )}

            {/* Slide-in panel */}
            {overlay && (
              <div style={{
                position: "absolute",
                ...(isFullScreenMode
                  ? { inset: 0 }
                  : creating
                    ? { top: 12, bottom: 12, left: "50%", transform: "translateX(-50%)" }
                    : { top: 12, right: 12, bottom: 12 }
                ),
                width: PANEL_W,
                background: "#13131c",
                borderRadius: isFullScreenMode ? 0 : 18,
                border: isFullScreenMode ? "none" : "1px solid rgba(255,255,255,0.09)",
                zIndex: 20,
                boxShadow: isFullScreenMode ? "none" : "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,107,53,0.04)",
                animation: isFullScreenMode ? "fadeIn 0.28s ease" : "slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}>
                {renderPanel()}
              </div>
            )}

            <Toast message={toast} />
          </div>
        </div>
      </>
    );
  }

  // ── MOBILE ────────────────────────────────────────────────────────
  // On mobile: TopNav at top, content fills, BottomNav at bottom.
  // Overlay screens push in full-screen.
  const mobileTitle =
    chatActivity?.title ||
    (creating ? "New Activity" : null) ||
    selectedActivity?.title ||
    (selectedUser ? selectedUser.name : null) ||
    (showNotifications ? "Notifications" : null) ||
    (showRequests ? `Requests (${requestCount})` : null) ||
    (showPeople   ? "People Nearby" : null) ||
    (showCalendar ? "My Calendar"   : null) ||
    (showProfile ? "Profile" : null) || "";

  return (
    <>
      <GlobalStyles />
      <div style={{
        width: "100%", height: "100vh", background: "#0d0d12",
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}>
        {/* Always-visible top nav on main screens; back bar on sub-screens */}
        {overlay
          ? <TopBar title={mobileTitle} onBack={handleBack} />
          : <TopNav {...navProps} />
        }

        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {overlay ? renderPanel() : renderPage()}
        </div>

        {!overlay && (
          <BottomNav
            activeTab={tab}
            onTabChange={handleTabChange}
            unreadCount={unreadCount}
            onNotificationsClick={handleNotifications}
            onProfileClick={handleProfile}
            user={user}
          />
        )}

        <Toast message={toast} />
      </div>
    </>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; }
      body { background: #0a0a0f; }
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.4); }
      input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.4); }
      @keyframes slideInRight {
        from { transform: translateX(36px); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0);   }
      }
    `}</style>
  );
}
