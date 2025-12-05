import { useEffect } from "react";

export default function ReminderListener() {
  useEffect(() => {
    console.log("🟡 Opening WebSocket...");
    const socket = new WebSocket("ws://localhost:8000/ws/reminders/");

    socket.onopen = () => console.log("✅ WebSocket Connected");

    socket.onmessage = (event) => {
      console.log("📩 MESSAGE RECEIVED FROM SERVER:", event.data);

      const data = JSON.parse(event.data);

      if (Notification.permission === "granted") {
        new Notification("⏰ Reminder", { body: data.message });
      }
    };

    socket.onclose = () => console.log("🔌 WebSocket Disconnected");

    return () => socket.close();
  }, []);

  return null;
}
