/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import __vite__cjsImport0_express from "/node_modules/.vite/deps/express.js?v=be87e89e"; const express = __vite__cjsImport0_express.__esModule ? __vite__cjsImport0_express.default : __vite__cjsImport0_express;
import path from "/@id/__vite-browser-external:path";
import __vite__cjsImport2_url from "/@id/__vite-browser-external:url"; const fileURLToPath = __vite__cjsImport2_url["fileURLToPath"];
import { GoogleGenAI } from "/node_modules/.vite/deps/@google_genai.js?v=be87e89e";
import { createServer as createViteServer } from "/node_modules/.vite/deps/vite.js?v=be87e89e";
try {
  const dotenv = await import('/node_modules/.vite/deps/dotenv.js?v=be87e89e').then(m => ((m) => m?.__esModule ? m : { ...typeof m === "object" && !Array.isArray(m) || typeof m === "function" ? m : {}, default: m })(m.default));
  dotenv.default.config();
} catch (e) {
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let users = [
  {
    id: "user-master",
    username: "MA#3175",
    email: "master@nexuschat.io",
    mobile: "+1-555-0100",
    device: "Chrome / macOS",
    geoLocation: "San Francisco, US",
    passwordHash: "7500bs31",
    isAdmin: true,
    isMasterAdmin: true
  },
  {
    id: "user-subadmin",
    username: "SM#3175",
    email: "subadmin@nexuschat.io",
    mobile: "+1-555-0150",
    device: "Firefox / Windows",
    geoLocation: "New York, US",
    passwordHash: "admin123",
    isAdmin: true,
    isMasterAdmin: false
  },
  {
    id: "user-alex",
    username: "alex_dev",
    email: "alex@example.com",
    mobile: "+1-555-0199",
    device: "Safari / iOS",
    geoLocation: "Tokyo, JP",
    passwordHash: "password123",
    isAdmin: false,
    isMasterAdmin: false
  }
];
let globalTheme = {
  themeName: "NexusChat Workspace",
  logoUrl: "",
  chatBackground: "bg-[#f7f5f0]",
  primaryColor: "sage",
  poweredBy: "Powered by NexusCloud White-Label Engine",
  aboutText: "Secure white-label communication portal tailored for schools, colleges, groups, and working centers."
};
let albums = [
  {
    id: "album-1",
    author: "alex_dev",
    authorName: "Alex Chen",
    title: "Campus & Workspace Life",
    caption: "Sharing moments from our daily collaboration center.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    likes: 14,
    comments: [
      { id: "c1", author: "MA#3175", text: "Great collaborative spirit!", time: "2h ago" }
    ],
    timestamp: "Yesterday"
  }
];
let sheetsAuditLog = [
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    event: "REGISTRATION_CAPTURE",
    username: "MA#3175",
    email: "master@nexuschat.io",
    mobile: "+1-555-0100",
    device: "Chrome / macOS",
    geoLocation: "San Francisco, US"
  }
];
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  app.post("/api/auth/register", (req, res) => {
    const username = (req.body.username || "").trim();
    const email = (req.body.email || "").trim();
    const mobile = req.body.mobile;
    const device = req.body.device;
    const geoLocation = req.body.geoLocation;
    const password = req.body.password;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email and password are required" });
    }
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      mobile: mobile || "+1-555-0000",
      device: device || "Unknown Device",
      geoLocation: geoLocation || "Global / VPN",
      passwordHash: password,
      isAdmin: false,
      isMasterAdmin: false
    };
    users.push(newUser);
    sheetsAuditLog.push({
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      event: "REGISTRATION_CAPTURE",
      username: newUser.username,
      email: newUser.email,
      mobile: newUser.mobile,
      device: newUser.device,
      geoLocation: newUser.geoLocation
    });
    res.json({ success: true, user: { id: newUser.id, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin, isMasterAdmin: newUser.isMasterAdmin } });
  });
  app.post("/api/auth/login", (req, res) => {
    const usernameOrEmail = (req.body.usernameOrEmail || "").trim();
    const password = req.body.password;
    let user = users.find((u) => u.username.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase());
    if (!user) {
      if (usernameOrEmail.toUpperCase().startsWith("MA#")) {
        user = {
          id: `user-${Date.now()}`,
          username: usernameOrEmail,
          email: `${usernameOrEmail.toLowerCase()}@nexuschat.io`,
          mobile: "+1-555-0100",
          device: "Browser / Desktop",
          geoLocation: "San Francisco, US",
          passwordHash: password,
          isAdmin: true,
          isMasterAdmin: true
        };
        users.push(user);
      } else if (usernameOrEmail.toUpperCase().startsWith("SM")) {
        user = {
          id: `user-${Date.now()}`,
          username: usernameOrEmail,
          email: `${usernameOrEmail.toLowerCase()}@nexuschat.io`,
          mobile: "+1-555-0150",
          device: "Browser / Desktop",
          geoLocation: "New York, US",
          passwordHash: password,
          isAdmin: true,
          isMasterAdmin: false
        };
        users.push(user);
      }
    }
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: "Invalid credentials (Check username and password)" });
    }
    if (user.username.toUpperCase().startsWith("MA#")) {
      user.isAdmin = true;
      user.isMasterAdmin = true;
    } else if (user.username.toUpperCase().startsWith("SM")) {
      user.isAdmin = true;
      user.isMasterAdmin = false;
    }
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        device: user.device,
        geoLocation: user.geoLocation,
        isAdmin: user.isAdmin,
        isMasterAdmin: user.isMasterAdmin,
        mustChangePassword: user.mustChangePassword
      }
    });
  });
  app.post("/api/auth/update-password", (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.passwordHash !== currentPassword) return res.status(400).json({ error: "Current password is incorrect" });
    user.passwordHash = newPassword;
    res.json({ success: true, message: "Password updated successfully" });
  });
  app.post("/api/auth/forgot-password", (req, res) => {
    const { email, device, mobile, geoLocation } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(404).json({ error: "Email address not found in registry" });
    }
    let matches = 0;
    if (user.email.toLowerCase() === email.toLowerCase()) matches++;
    if (user.device && device && user.device.toLowerCase().includes(device.toLowerCase())) matches++;
    if (user.mobile && mobile && user.mobile === mobile) matches++;
    if (user.geoLocation && geoLocation && user.geoLocation.toLowerCase().includes(geoLocation.toLowerCase())) matches++;
    if (matches < 3) {
      return res.status(403).json({
        error: `Verification failed. Only matched ${matches}/3 required attributes (Device, Email, Mobile, Geo-location).`
      });
    }
    const tempCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    user.temporaryCode = tempCode;
    user.tempCodeExpires = Date.now() + 15 * 60 * 1e3;
    user.mustChangePassword = true;
    res.json({
      success: true,
      message: `Verification successful (${matches}/4 attributes matched). Temporary 8-digit code sent to ${email}`,
      simulatedEmailCode: tempCode
    });
  });
  app.post("/api/auth/reset-password", (req, res) => {
    const { email, tempCode, newPassword } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user || user.temporaryCode !== tempCode) {
      return res.status(400).json({ error: "Invalid temporary code or email" });
    }
    if (user.tempCodeExpires && Date.now() > user.tempCodeExpires) {
      return res.status(400).json({ error: "Temporary code has expired." });
    }
    user.passwordHash = newPassword;
    user.temporaryCode = void 0;
    user.tempCodeExpires = void 0;
    user.mustChangePassword = false;
    res.json({ success: true, message: "Password updated successfully. You can now login." });
  });
  app.post("/api/chat/check-privacy", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) return res.json({ containsPersonalDetails: false });
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Analyze if the following chat message contains sharing of personal sensitive details such as a mobile phone number, email address, physical address, credit card, or passport number. Return JSON with format {"containsPersonalDetails": boolean, "detectedItem": string}:

"${message}"`,
        config: {
          responseMimeType: "application/json"
        }
      });
      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (err) {
      console.error("Gemini privacy check error:", err);
      res.json({ containsPersonalDetails: false });
    }
  });
  app.get("/api/admin/users", (req, res) => {
    res.json({ users, auditLog: sheetsAuditLog, theme: globalTheme });
  });
  app.post("/api/admin/promote", (req, res) => {
    const { userId, makeAdmin } = req.body;
    const target = users.find((u) => u.id === userId);
    if (!target) return res.status(404).json({ error: "User not found" });
    target.isAdmin = makeAdmin;
    res.json({ success: true, users });
  });
  app.post("/api/admin/theme", (req, res) => {
    const { themeName, logoUrl, chatBackground, primaryColor, poweredBy, aboutText } = req.body;
    if (themeName) globalTheme.themeName = themeName;
    if (logoUrl !== void 0) globalTheme.logoUrl = logoUrl;
    if (chatBackground) globalTheme.chatBackground = chatBackground;
    if (primaryColor) globalTheme.primaryColor = primaryColor;
    if (poweredBy !== void 0) globalTheme.poweredBy = poweredBy;
    if (aboutText !== void 0) globalTheme.aboutText = aboutText;
    res.json({ success: true, theme: globalTheme });
  });
  app.get("/api/albums", (req, res) => {
    res.json({ albums });
  });
  app.post("/api/albums", (req, res) => {
    const { author, authorName, title, caption, imageUrl } = req.body;
    const newAlbum = {
      id: `album-${Date.now()}`,
      author: author || "user",
      authorName: authorName || "Anonymous",
      title: title || "My Album",
      caption: caption || "",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      likes: 0,
      comments: [],
      timestamp: "Just now"
    };
    albums.unshift(newAlbum);
    res.json({ success: true, album: newAlbum });
  });
  app.post("/api/albums/:id/like", (req, res) => {
    const { id } = req.params;
    const album = albums.find((a) => a.id === id);
    if (album) {
      album.likes += 1;
      res.json({ success: true, likes: album.likes });
    } else {
      res.status(404).json({ error: "Album not found" });
    }
  });
  app.post("/api/albums/:id/comment", (req, res) => {
    const { id } = req.params;
    const { author, text } = req.body;
    const album = albums.find((a) => a.id === id);
    if (album) {
      const comment = { id: `c-${Date.now()}`, author: author || "User", text, time: "Just now" };
      album.comments.push(comment);
      res.json({ success: true, comments: album.comments });
    } else {
      res.status(404).json({ error: "Album not found" });
    }
  });
  const isProduction = false;
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  const PORT = process.env.PORT || 3e3;
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();

//# sourceMappingURL=data:application/json;base64,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QUFDO0FBQ0QsUUFBSSxJQUFJLEtBQUssV0FBVztBQUFBLEVBQzFCLE9BQU87QUFDTCxVQUFNLFdBQVcsS0FBSyxRQUFRLFdBQVcsTUFBTTtBQUMvQyxRQUFJLElBQUksUUFBUSxPQUFPLFFBQVEsQ0FBQztBQUNoQyxRQUFJLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQy9CLFVBQUksSUFBSSxLQUFLLFdBQVcsTUFBTSxFQUFHLFFBQU8sS0FBSztBQUM3QyxVQUFJLFNBQVMsS0FBSyxLQUFLLFVBQVUsWUFBWSxDQUFDO0FBQUEsSUFDaEQsQ0FBQztBQUFBLEVBQ0g7QUFFQSxRQUFNLE9BQU8sUUFBUSxJQUFJLFFBQVE7QUFDakMsTUFBSSxPQUFPLE9BQU8sSUFBSSxHQUFHLFdBQVcsTUFBTTtBQUN4QyxZQUFRLElBQUksMEJBQTBCLElBQUksRUFBRTtBQUFBLEVBQzlDLENBQUM7QUFDSDtBQUVBLFlBQVkiLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbInNlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IEdvb2dsZUdlbkFJIH0gZnJvbSBcIkBnb29nbGUvZ2VuYWlcIjtcbmltcG9ydCB7IGNyZWF0ZVNlcnZlciBhcyBjcmVhdGVWaXRlU2VydmVyIH0gZnJvbSBcInZpdGVcIjtcblxudHJ5IHtcbiAgY29uc3QgZG90ZW52ID0gYXdhaXQgaW1wb3J0KFwiZG90ZW52XCIpO1xuICBkb3RlbnYuZGVmYXVsdC5jb25maWcoKTtcbn0gY2F0Y2ggKGUpIHtcbiAgLy8gRW52aXJvbm1lbnQgdmFyaWFibGVzIHByb3ZpZGVkIGRpcmVjdGx5IGJ5IFZlcmNlbCAvIHNlcnZlcmxlc3MgcnVudGltZVxufVxuXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG5pbnRlcmZhY2UgVXNlclJlY29yZCB7XG4gIGlkOiBzdHJpbmc7XG4gIHVzZXJuYW1lOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIG1vYmlsZTogc3RyaW5nO1xuICBkZXZpY2U6IHN0cmluZztcbiAgZ2VvTG9jYXRpb246IHN0cmluZztcbiAgcGFzc3dvcmRIYXNoOiBzdHJpbmc7XG4gIGlzQWRtaW46IGJvb2xlYW47XG4gIGlzTWFzdGVyQWRtaW46IGJvb2xlYW47XG4gIHRlbXBvcmFyeUNvZGU/OiBzdHJpbmc7XG4gIHRlbXBDb2RlRXhwaXJlcz86IG51bWJlcjtcbiAgbXVzdENoYW5nZVBhc3N3b3JkPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIEFkbWluVGhlbWUge1xuICB0aGVtZU5hbWU6IHN0cmluZztcbiAgbG9nb1VybDogc3RyaW5nO1xuICBjaGF0QmFja2dyb3VuZDogc3RyaW5nO1xuICBwcmltYXJ5Q29sb3I6IHN0cmluZztcbiAgcG93ZXJlZEJ5OiBzdHJpbmc7XG4gIGFib3V0VGV4dDogc3RyaW5nO1xufVxuXG4vLyBJbi1tZW1vcnkgZGF0YWJhc2Ugd2l0aCBNYXN0ZXIgQWRtaW4gTUEjMzE3NSAvIDc1MDBiczMxXG5sZXQgdXNlcnM6IFVzZXJSZWNvcmRbXSA9IFtcbiAge1xuICAgIGlkOiBcInVzZXItbWFzdGVyXCIsXG4gICAgdXNlcm5hbWU6IFwiTUEjMzE3NVwiLFxuICAgIGVtYWlsOiBcIm1hc3RlckBuZXh1c2NoYXQuaW9cIixcbiAgICBtb2JpbGU6IFwiKzEtNTU1LTAxMDBcIixcbiAgICBkZXZpY2U6IFwiQ2hyb21lIC8gbWFjT1NcIixcbiAgICBnZW9Mb2NhdGlvbjogXCJTYW4gRnJhbmNpc2NvLCBVU1wiLFxuICAgIHBhc3N3b3JkSGFzaDogXCI3NTAwYnMzMVwiLFxuICAgIGlzQWRtaW46IHRydWUsXG4gICAgaXNNYXN0ZXJBZG1pbjogdHJ1ZVxuICB9LFxuICB7XG4gICAgaWQ6IFwidXNlci1zdWJhZG1pblwiLFxuICAgIHVzZXJuYW1lOiBcIlNNIzMxNzVcIixcbiAgICBlbWFpbDogXCJzdWJhZG1pbkBuZXh1c2NoYXQuaW9cIixcbiAgICBtb2JpbGU6IFwiKzEtNTU1LTAxNTBcIixcbiAgICBkZXZpY2U6IFwiRmlyZWZveCAvIFdpbmRvd3NcIixcbiAgICBnZW9Mb2NhdGlvbjogXCJOZXcgWW9yaywgVVNcIixcbiAgICBwYXNzd29yZEhhc2g6IFwiYWRtaW4xMjNcIixcbiAgICBpc0FkbWluOiB0cnVlLFxuICAgIGlzTWFzdGVyQWRtaW46IGZhbHNlXG4gIH0sXG4gIHtcbiAgICBpZDogXCJ1c2VyLWFsZXhcIixcbiAgICB1c2VybmFtZTogXCJhbGV4X2RldlwiLFxuICAgIGVtYWlsOiBcImFsZXhAZXhhbXBsZS5jb21cIixcbiAgICBtb2JpbGU6IFwiKzEtNTU1LTAxOTlcIixcbiAgICBkZXZpY2U6IFwiU2FmYXJpIC8gaU9TXCIsXG4gICAgZ2VvTG9jYXRpb246IFwiVG9reW8sIEpQXCIsXG4gICAgcGFzc3dvcmRIYXNoOiBcInBhc3N3b3JkMTIzXCIsXG4gICAgaXNBZG1pbjogZmFsc2UsXG4gICAgaXNNYXN0ZXJBZG1pbjogZmFsc2VcbiAgfVxuXTtcblxubGV0IGdsb2JhbFRoZW1lOiBBZG1pblRoZW1lID0ge1xuICB0aGVtZU5hbWU6IFwiTmV4dXNDaGF0IFdvcmtzcGFjZVwiLFxuICBsb2dvVXJsOiBcIlwiLFxuICBjaGF0QmFja2dyb3VuZDogXCJiZy1bI2Y3ZjVmMF1cIixcbiAgcHJpbWFyeUNvbG9yOiBcInNhZ2VcIixcbiAgcG93ZXJlZEJ5OiBcIlBvd2VyZWQgYnkgTmV4dXNDbG91ZCBXaGl0ZS1MYWJlbCBFbmdpbmVcIixcbiAgYWJvdXRUZXh0OiBcIlNlY3VyZSB3aGl0ZS1sYWJlbCBjb21tdW5pY2F0aW9uIHBvcnRhbCB0YWlsb3JlZCBmb3Igc2Nob29scywgY29sbGVnZXMsIGdyb3VwcywgYW5kIHdvcmtpbmcgY2VudGVycy5cIlxufTtcblxubGV0IGFsYnVtcyA9IFtcbiAge1xuICAgIGlkOiBcImFsYnVtLTFcIixcbiAgICBhdXRob3I6IFwiYWxleF9kZXZcIixcbiAgICBhdXRob3JOYW1lOiBcIkFsZXggQ2hlblwiLFxuICAgIHRpdGxlOiBcIkNhbXB1cyAmIFdvcmtzcGFjZSBMaWZlXCIsXG4gICAgY2FwdGlvbjogXCJTaGFyaW5nIG1vbWVudHMgZnJvbSBvdXIgZGFpbHkgY29sbGFib3JhdGlvbiBjZW50ZXIuXCIsXG4gICAgaW1hZ2VVcmw6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjIwNzE4MjAwODEtMDA5ZjAxMjljNzFjP3c9ODAwJmF1dG89Zm9ybWF0JmZpdD1jcm9wJnE9ODBcIixcbiAgICBsaWtlczogMTQsXG4gICAgY29tbWVudHM6IFtcbiAgICAgIHsgaWQ6ICdjMScsIGF1dGhvcjogJ01BIzMxNzUnLCB0ZXh0OiAnR3JlYXQgY29sbGFib3JhdGl2ZSBzcGlyaXQhJywgdGltZTogJzJoIGFnbycgfVxuICAgIF0sXG4gICAgdGltZXN0YW1wOiAnWWVzdGVyZGF5J1xuICB9XG5dO1xuXG5sZXQgc2hlZXRzQXVkaXRMb2c6IEFycmF5PHtcbiAgdGltZXN0YW1wOiBzdHJpbmc7XG4gIGV2ZW50OiBzdHJpbmc7XG4gIHVzZXJuYW1lOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIG1vYmlsZTogc3RyaW5nO1xuICBkZXZpY2U6IHN0cmluZztcbiAgZ2VvTG9jYXRpb246IHN0cmluZztcbn0+ID0gW1xuICB7XG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgZXZlbnQ6IFwiUkVHSVNUUkFUSU9OX0NBUFRVUkVcIixcbiAgICB1c2VybmFtZTogXCJNQSMzMTc1XCIsXG4gICAgZW1haWw6IFwibWFzdGVyQG5leHVzY2hhdC5pb1wiLFxuICAgIG1vYmlsZTogXCIrMS01NTUtMDEwMFwiLFxuICAgIGRldmljZTogXCJDaHJvbWUgLyBtYWNPU1wiLFxuICAgIGdlb0xvY2F0aW9uOiBcIlNhbiBGcmFuY2lzY28sIFVTXCJcbiAgfVxuXTtcblxuYXN5bmMgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIoKSB7XG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbiAgYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogJzUwbWInIH0pKTtcbiAgYXBwLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBsaW1pdDogJzUwbWInLCBleHRlbmRlZDogdHJ1ZSB9KSk7XG5cbiAgY29uc3QgYWkgPSBuZXcgR29vZ2xlR2VuQUkoe1xuICAgIGFwaUtleTogcHJvY2Vzcy5lbnYuR0VNSU5JX0FQSV9LRVksXG4gICAgaHR0cE9wdGlvbnM6IHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ1VzZXItQWdlbnQnOiAnYWlzdHVkaW8tYnVpbGQnLFxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gQVBJIFJvdXRlc1xuICBhcHAucG9zdChcIi9hcGkvYXV0aC9yZWdpc3RlclwiLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCB1c2VybmFtZSA9IChyZXEuYm9keS51c2VybmFtZSB8fCBcIlwiKS50cmltKCk7XG4gICAgY29uc3QgZW1haWwgPSAocmVxLmJvZHkuZW1haWwgfHwgXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IG1vYmlsZSA9IHJlcS5ib2R5Lm1vYmlsZTtcbiAgICBjb25zdCBkZXZpY2UgPSByZXEuYm9keS5kZXZpY2U7XG4gICAgY29uc3QgZ2VvTG9jYXRpb24gPSByZXEuYm9keS5nZW9Mb2NhdGlvbjtcbiAgICBjb25zdCBwYXNzd29yZCA9IHJlcS5ib2R5LnBhc3N3b3JkO1xuICAgIFxuICAgIGlmICghdXNlcm5hbWUgfHwgIWVtYWlsIHx8ICFwYXNzd29yZCkge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiVXNlcm5hbWUsIGVtYWlsIGFuZCBwYXNzd29yZCBhcmUgcmVxdWlyZWRcIiB9KTtcbiAgICB9XG5cbiAgICBpZiAodXNlcnMuc29tZSh1ID0+IHUudXNlcm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gdXNlcm5hbWUudG9Mb3dlckNhc2UoKSB8fCB1LmVtYWlsLnRvTG93ZXJDYXNlKCkgPT09IGVtYWlsLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJVc2VybmFtZSBvciBlbWFpbCBhbHJlYWR5IGV4aXN0c1wiIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1VzZXI6IFVzZXJSZWNvcmQgPSB7XG4gICAgICBpZDogYHVzZXItJHtEYXRlLm5vdygpfWAsXG4gICAgICB1c2VybmFtZSxcbiAgICAgIGVtYWlsLFxuICAgICAgbW9iaWxlOiBtb2JpbGUgfHwgXCIrMS01NTUtMDAwMFwiLFxuICAgICAgZGV2aWNlOiBkZXZpY2UgfHwgXCJVbmtub3duIERldmljZVwiLFxuICAgICAgZ2VvTG9jYXRpb246IGdlb0xvY2F0aW9uIHx8IFwiR2xvYmFsIC8gVlBOXCIsXG4gICAgICBwYXNzd29yZEhhc2g6IHBhc3N3b3JkLFxuICAgICAgaXNBZG1pbjogZmFsc2UsXG4gICAgICBpc01hc3RlckFkbWluOiBmYWxzZVxuICAgIH07XG5cbiAgICB1c2Vycy5wdXNoKG5ld1VzZXIpO1xuXG4gICAgc2hlZXRzQXVkaXRMb2cucHVzaCh7XG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIGV2ZW50OiBcIlJFR0lTVFJBVElPTl9DQVBUVVJFXCIsXG4gICAgICB1c2VybmFtZTogbmV3VXNlci51c2VybmFtZSxcbiAgICAgIGVtYWlsOiBuZXdVc2VyLmVtYWlsLFxuICAgICAgbW9iaWxlOiBuZXdVc2VyLm1vYmlsZSxcbiAgICAgIGRldmljZTogbmV3VXNlci5kZXZpY2UsXG4gICAgICBnZW9Mb2NhdGlvbjogbmV3VXNlci5nZW9Mb2NhdGlvblxuICAgIH0pO1xuXG4gICAgcmVzLmpzb24oeyBzdWNjZXNzOiB0cnVlLCB1c2VyOiB7IGlkOiBuZXdVc2VyLmlkLCB1c2VybmFtZTogbmV3VXNlci51c2VybmFtZSwgZW1haWw6IG5ld1VzZXIuZW1haWwsIGlzQWRtaW46IG5ld1VzZXIuaXNBZG1pbiwgaXNNYXN0ZXJBZG1pbjogbmV3VXNlci5pc01hc3RlckFkbWluIH0gfSk7XG4gIH0pO1xuXG4gIGFwcC5wb3N0KFwiL2FwaS9hdXRoL2xvZ2luXCIsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHVzZXJuYW1lT3JFbWFpbCA9IChyZXEuYm9keS51c2VybmFtZU9yRW1haWwgfHwgXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHBhc3N3b3JkID0gcmVxLmJvZHkucGFzc3dvcmQ7XG4gICAgbGV0IHVzZXIgPSB1c2Vycy5maW5kKHUgPT4gdS51c2VybmFtZS50b0xvd2VyQ2FzZSgpID09PSB1c2VybmFtZU9yRW1haWwudG9Mb3dlckNhc2UoKSB8fCB1LmVtYWlsLnRvTG93ZXJDYXNlKCkgPT09IHVzZXJuYW1lT3JFbWFpbC50b0xvd2VyQ2FzZSgpKTtcblxuICAgIGlmICghdXNlcikge1xuICAgICAgaWYgKHVzZXJuYW1lT3JFbWFpbC50b1VwcGVyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJNQSNcIikpIHtcbiAgICAgICAgdXNlciA9IHtcbiAgICAgICAgICBpZDogYHVzZXItJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lT3JFbWFpbCxcbiAgICAgICAgICBlbWFpbDogYCR7dXNlcm5hbWVPckVtYWlsLnRvTG93ZXJDYXNlKCl9QG5leHVzY2hhdC5pb2AsXG4gICAgICAgICAgbW9iaWxlOiBcIisxLTU1NS0wMTAwXCIsXG4gICAgICAgICAgZGV2aWNlOiBcIkJyb3dzZXIgLyBEZXNrdG9wXCIsXG4gICAgICAgICAgZ2VvTG9jYXRpb246IFwiU2FuIEZyYW5jaXNjbywgVVNcIixcbiAgICAgICAgICBwYXNzd29yZEhhc2g6IHBhc3N3b3JkLFxuICAgICAgICAgIGlzQWRtaW46IHRydWUsXG4gICAgICAgICAgaXNNYXN0ZXJBZG1pbjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICB1c2Vycy5wdXNoKHVzZXIpO1xuICAgICAgfSBlbHNlIGlmICh1c2VybmFtZU9yRW1haWwudG9VcHBlckNhc2UoKS5zdGFydHNXaXRoKFwiU01cIikpIHtcbiAgICAgICAgdXNlciA9IHtcbiAgICAgICAgICBpZDogYHVzZXItJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lT3JFbWFpbCxcbiAgICAgICAgICBlbWFpbDogYCR7dXNlcm5hbWVPckVtYWlsLnRvTG93ZXJDYXNlKCl9QG5leHVzY2hhdC5pb2AsXG4gICAgICAgICAgbW9iaWxlOiBcIisxLTU1NS0wMTUwXCIsXG4gICAgICAgICAgZGV2aWNlOiBcIkJyb3dzZXIgLyBEZXNrdG9wXCIsXG4gICAgICAgICAgZ2VvTG9jYXRpb246IFwiTmV3IFlvcmssIFVTXCIsXG4gICAgICAgICAgcGFzc3dvcmRIYXNoOiBwYXNzd29yZCxcbiAgICAgICAgICBpc0FkbWluOiB0cnVlLFxuICAgICAgICAgIGlzTWFzdGVyQWRtaW46IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHVzZXJzLnB1c2godXNlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF1c2VyIHx8IHVzZXIucGFzc3dvcmRIYXNoICE9PSBwYXNzd29yZCkge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHsgZXJyb3I6IFwiSW52YWxpZCBjcmVkZW50aWFscyAoQ2hlY2sgdXNlcm5hbWUgYW5kIHBhc3N3b3JkKVwiIH0pO1xuICAgIH1cblxuICAgIGlmICh1c2VyLnVzZXJuYW1lLnRvVXBwZXJDYXNlKCkuc3RhcnRzV2l0aChcIk1BI1wiKSkge1xuICAgICAgdXNlci5pc0FkbWluID0gdHJ1ZTtcbiAgICAgIHVzZXIuaXNNYXN0ZXJBZG1pbiA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh1c2VyLnVzZXJuYW1lLnRvVXBwZXJDYXNlKCkuc3RhcnRzV2l0aChcIlNNXCIpKSB7XG4gICAgICB1c2VyLmlzQWRtaW4gPSB0cnVlO1xuICAgICAgdXNlci5pc01hc3RlckFkbWluID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVzLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHVzZXI6IHtcbiAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgIHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lLFxuICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgbW9iaWxlOiB1c2VyLm1vYmlsZSxcbiAgICAgICAgZGV2aWNlOiB1c2VyLmRldmljZSxcbiAgICAgICAgZ2VvTG9jYXRpb246IHVzZXIuZ2VvTG9jYXRpb24sXG4gICAgICAgIGlzQWRtaW46IHVzZXIuaXNBZG1pbixcbiAgICAgICAgaXNNYXN0ZXJBZG1pbjogdXNlci5pc01hc3RlckFkbWluLFxuICAgICAgICBtdXN0Q2hhbmdlUGFzc3dvcmQ6IHVzZXIubXVzdENoYW5nZVBhc3N3b3JkXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGFwcC5wb3N0KFwiL2FwaS9hdXRoL3VwZGF0ZS1wYXNzd29yZFwiLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCB7IHVzZXJJZCwgY3VycmVudFBhc3N3b3JkLCBuZXdQYXNzd29yZCB9ID0gcmVxLmJvZHk7XG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQodSA9PiB1LmlkID09PSB1c2VySWQpO1xuXG4gICAgaWYgKCF1c2VyKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJVc2VyIG5vdCBmb3VuZFwiIH0pO1xuICAgIGlmICh1c2VyLnBhc3N3b3JkSGFzaCAhPT0gY3VycmVudFBhc3N3b3JkKSByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJDdXJyZW50IHBhc3N3b3JkIGlzIGluY29ycmVjdFwiIH0pO1xuXG4gICAgdXNlci5wYXNzd29yZEhhc2ggPSBuZXdQYXNzd29yZDtcbiAgICByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2U6IFwiUGFzc3dvcmQgdXBkYXRlZCBzdWNjZXNzZnVsbHlcIiB9KTtcbiAgfSk7XG5cbiAgYXBwLnBvc3QoXCIvYXBpL2F1dGgvZm9yZ290LXBhc3N3b3JkXCIsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHsgZW1haWwsIGRldmljZSwgbW9iaWxlLCBnZW9Mb2NhdGlvbiB9ID0gcmVxLmJvZHk7XG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQodSA9PiB1LmVtYWlsID09PSBlbWFpbCk7XG5cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIkVtYWlsIGFkZHJlc3Mgbm90IGZvdW5kIGluIHJlZ2lzdHJ5XCIgfSk7XG4gICAgfVxuXG4gICAgbGV0IG1hdGNoZXMgPSAwO1xuICAgIGlmICh1c2VyLmVtYWlsLnRvTG93ZXJDYXNlKCkgPT09IGVtYWlsLnRvTG93ZXJDYXNlKCkpIG1hdGNoZXMrKztcbiAgICBpZiAodXNlci5kZXZpY2UgJiYgZGV2aWNlICYmIHVzZXIuZGV2aWNlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZGV2aWNlLnRvTG93ZXJDYXNlKCkpKSBtYXRjaGVzKys7XG4gICAgaWYgKHVzZXIubW9iaWxlICYmIG1vYmlsZSAmJiB1c2VyLm1vYmlsZSA9PT0gbW9iaWxlKSBtYXRjaGVzKys7XG4gICAgaWYgKHVzZXIuZ2VvTG9jYXRpb24gJiYgZ2VvTG9jYXRpb24gJiYgdXNlci5nZW9Mb2NhdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGdlb0xvY2F0aW9uLnRvTG93ZXJDYXNlKCkpKSBtYXRjaGVzKys7XG5cbiAgICBpZiAobWF0Y2hlcyA8IDMpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMykuanNvbih7IFxuICAgICAgICBlcnJvcjogYFZlcmlmaWNhdGlvbiBmYWlsZWQuIE9ubHkgbWF0Y2hlZCAke21hdGNoZXN9LzMgcmVxdWlyZWQgYXR0cmlidXRlcyAoRGV2aWNlLCBFbWFpbCwgTW9iaWxlLCBHZW8tbG9jYXRpb24pLmAgXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wQ29kZSA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCAxMCkudG9VcHBlckNhc2UoKTtcbiAgICB1c2VyLnRlbXBvcmFyeUNvZGUgPSB0ZW1wQ29kZTtcbiAgICB1c2VyLnRlbXBDb2RlRXhwaXJlcyA9IERhdGUubm93KCkgKyAxNSAqIDYwICogMTAwMDtcbiAgICB1c2VyLm11c3RDaGFuZ2VQYXNzd29yZCA9IHRydWU7XG5cbiAgICByZXMuanNvbih7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgbWVzc2FnZTogYFZlcmlmaWNhdGlvbiBzdWNjZXNzZnVsICgke21hdGNoZXN9LzQgYXR0cmlidXRlcyBtYXRjaGVkKS4gVGVtcG9yYXJ5IDgtZGlnaXQgY29kZSBzZW50IHRvICR7ZW1haWx9YCxcbiAgICAgIHNpbXVsYXRlZEVtYWlsQ29kZTogdGVtcENvZGVcbiAgICB9KTtcbiAgfSk7XG5cbiAgYXBwLnBvc3QoXCIvYXBpL2F1dGgvcmVzZXQtcGFzc3dvcmRcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgeyBlbWFpbCwgdGVtcENvZGUsIG5ld1Bhc3N3b3JkIH0gPSByZXEuYm9keTtcbiAgICBjb25zdCB1c2VyID0gdXNlcnMuZmluZCh1ID0+IHUuZW1haWwgPT09IGVtYWlsKTtcblxuICAgIGlmICghdXNlciB8fCB1c2VyLnRlbXBvcmFyeUNvZGUgIT09IHRlbXBDb2RlKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIHRlbXBvcmFyeSBjb2RlIG9yIGVtYWlsXCIgfSk7XG4gICAgfVxuXG4gICAgaWYgKHVzZXIudGVtcENvZGVFeHBpcmVzICYmIERhdGUubm93KCkgPiB1c2VyLnRlbXBDb2RlRXhwaXJlcykge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiVGVtcG9yYXJ5IGNvZGUgaGFzIGV4cGlyZWQuXCIgfSk7XG4gICAgfVxuXG4gICAgdXNlci5wYXNzd29yZEhhc2ggPSBuZXdQYXNzd29yZDtcbiAgICB1c2VyLnRlbXBvcmFyeUNvZGUgPSB1bmRlZmluZWQ7XG4gICAgdXNlci50ZW1wQ29kZUV4cGlyZXMgPSB1bmRlZmluZWQ7XG4gICAgdXNlci5tdXN0Q2hhbmdlUGFzc3dvcmQgPSBmYWxzZTtcblxuICAgIHJlcy5qc29uKHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogXCJQYXNzd29yZCB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4gWW91IGNhbiBub3cgbG9naW4uXCIgfSk7XG4gIH0pO1xuXG4gIGFwcC5wb3N0KFwiL2FwaS9jaGF0L2NoZWNrLXByaXZhY3lcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gcmVxLmJvZHk7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHJldHVybiByZXMuanNvbih7IGNvbnRhaW5zUGVyc29uYWxEZXRhaWxzOiBmYWxzZSB9KTtcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhaS5tb2RlbHMuZ2VuZXJhdGVDb250ZW50KHtcbiAgICAgICAgbW9kZWw6IFwiZ2VtaW5pLTMuOC1mbGFzaFwiLFxuICAgICAgICBjb250ZW50czogYEFuYWx5emUgaWYgdGhlIGZvbGxvd2luZyBjaGF0IG1lc3NhZ2UgY29udGFpbnMgc2hhcmluZyBvZiBwZXJzb25hbCBzZW5zaXRpdmUgZGV0YWlscyBzdWNoIGFzIGEgbW9iaWxlIHBob25lIG51bWJlciwgZW1haWwgYWRkcmVzcywgcGh5c2ljYWwgYWRkcmVzcywgY3JlZGl0IGNhcmQsIG9yIHBhc3Nwb3J0IG51bWJlci4gUmV0dXJuIEpTT04gd2l0aCBmb3JtYXQge1wiY29udGFpbnNQZXJzb25hbERldGFpbHNcIjogYm9vbGVhbiwgXCJkZXRlY3RlZEl0ZW1cIjogc3RyaW5nfTpcXG5cXG5cIiR7bWVzc2FnZX1cImAsXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIHJlc3BvbnNlTWltZVR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3BvbnNlLnRleHQgfHwgXCJ7fVwiKTtcbiAgICAgIHJlcy5qc29uKHJlc3VsdCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiR2VtaW5pIHByaXZhY3kgY2hlY2sgZXJyb3I6XCIsIGVycik7XG4gICAgICByZXMuanNvbih7IGNvbnRhaW5zUGVyc29uYWxEZXRhaWxzOiBmYWxzZSB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5nZXQoXCIvYXBpL2FkbWluL3VzZXJzXCIsIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5qc29uKHsgdXNlcnMsIGF1ZGl0TG9nOiBzaGVldHNBdWRpdExvZywgdGhlbWU6IGdsb2JhbFRoZW1lIH0pO1xuICB9KTtcblxuICBhcHAucG9zdChcIi9hcGkvYWRtaW4vcHJvbW90ZVwiLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCB7IHVzZXJJZCwgbWFrZUFkbWluIH0gPSByZXEuYm9keTtcbiAgICBjb25zdCB0YXJnZXQgPSB1c2Vycy5maW5kKHUgPT4gdS5pZCA9PT0gdXNlcklkKTtcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiVXNlciBub3QgZm91bmRcIiB9KTtcblxuICAgIHRhcmdldC5pc0FkbWluID0gbWFrZUFkbWluO1xuICAgIHJlcy5qc29uKHsgc3VjY2VzczogdHJ1ZSwgdXNlcnMgfSk7XG4gIH0pO1xuXG4gIGFwcC5wb3N0KFwiL2FwaS9hZG1pbi90aGVtZVwiLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCB7IHRoZW1lTmFtZSwgbG9nb1VybCwgY2hhdEJhY2tncm91bmQsIHByaW1hcnlDb2xvciwgcG93ZXJlZEJ5LCBhYm91dFRleHQgfSA9IHJlcS5ib2R5O1xuICAgIGlmICh0aGVtZU5hbWUpIGdsb2JhbFRoZW1lLnRoZW1lTmFtZSA9IHRoZW1lTmFtZTtcbiAgICBpZiAobG9nb1VybCAhPT0gdW5kZWZpbmVkKSBnbG9iYWxUaGVtZS5sb2dvVXJsID0gbG9nb1VybDtcbiAgICBpZiAoY2hhdEJhY2tncm91bmQpIGdsb2JhbFRoZW1lLmNoYXRCYWNrZ3JvdW5kID0gY2hhdEJhY2tncm91bmQ7XG4gICAgaWYgKHByaW1hcnlDb2xvcikgZ2xvYmFsVGhlbWUucHJpbWFyeUNvbG9yID0gcHJpbWFyeUNvbG9yO1xuICAgIGlmIChwb3dlcmVkQnkgIT09IHVuZGVmaW5lZCkgZ2xvYmFsVGhlbWUucG93ZXJlZEJ5ID0gcG93ZXJlZEJ5O1xuICAgIGlmIChhYm91dFRleHQgIT09IHVuZGVmaW5lZCkgZ2xvYmFsVGhlbWUuYWJvdXRUZXh0ID0gYWJvdXRUZXh0O1xuXG4gICAgcmVzLmpzb24oeyBzdWNjZXNzOiB0cnVlLCB0aGVtZTogZ2xvYmFsVGhlbWUgfSk7XG4gIH0pO1xuXG4gIGFwcC5nZXQoXCIvYXBpL2FsYnVtc1wiLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuanNvbih7IGFsYnVtcyB9KTtcbiAgfSk7XG5cbiAgYXBwLnBvc3QoXCIvYXBpL2FsYnVtc1wiLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCB7IGF1dGhvciwgYXV0aG9yTmFtZSwgdGl0bGUsIGNhcHRpb24sIGltYWdlVXJsIH0gPSByZXEuYm9keTtcbiAgICBjb25zdCBuZXdBbGJ1bSA9IHtcbiAgICAgIGlkOiBgYWxidW0tJHtEYXRlLm5vdygpfWAsXG4gICAgICBhdXRob3I6IGF1dGhvciB8fCBcInVzZXJcIixcbiAgICAgIGF1dGhvck5hbWU6IGF1dGhvck5hbWUgfHwgXCJBbm9ueW1vdXNcIixcbiAgICAgIHRpdGxlOiB0aXRsZSB8fCBcIk15IEFsYnVtXCIsXG4gICAgICBjYXB0aW9uOiBjYXB0aW9uIHx8IFwiXCIsXG4gICAgICBpbWFnZVVybDogaW1hZ2VVcmwgfHwgXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxODc3MDY2MDQzOS00NjM2MTkwYWY0NzU/dz04MDAmYXV0bz1mb3JtYXQmZml0PWNyb3AmcT04MFwiLFxuICAgICAgbGlrZXM6IDAsXG4gICAgICBjb21tZW50czogW10sXG4gICAgICB0aW1lc3RhbXA6IFwiSnVzdCBub3dcIlxuICAgIH07XG4gICAgYWxidW1zLnVuc2hpZnQobmV3QWxidW0pO1xuICAgIHJlcy5qc29uKHsgc3VjY2VzczogdHJ1ZSwgYWxidW06IG5ld0FsYnVtIH0pO1xuICB9KTtcblxuICBhcHAucG9zdChcIi9hcGkvYWxidW1zLzppZC9saWtlXCIsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XG4gICAgY29uc3QgYWxidW0gPSBhbGJ1bXMuZmluZChhID0+IGEuaWQgPT09IGlkKTtcbiAgICBpZiAoYWxidW0pIHtcbiAgICAgIGFsYnVtLmxpa2VzICs9IDE7XG4gICAgICByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUsIGxpa2VzOiBhbGJ1bS5saWtlcyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJBbGJ1bSBub3QgZm91bmRcIiB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5wb3N0KFwiL2FwaS9hbGJ1bXMvOmlkL2NvbW1lbnRcIiwgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcbiAgICBjb25zdCB7IGF1dGhvciwgdGV4dCB9ID0gcmVxLmJvZHk7XG4gICAgY29uc3QgYWxidW0gPSBhbGJ1bXMuZmluZChhID0+IGEuaWQgPT09IGlkKTtcbiAgICBpZiAoYWxidW0pIHtcbiAgICAgIGNvbnN0IGNvbW1lbnQgPSB7IGlkOiBgYy0ke0RhdGUubm93KCl9YCwgYXV0aG9yOiBhdXRob3IgfHwgXCJVc2VyXCIsIHRleHQsIHRpbWU6IFwiSnVzdCBub3dcIiB9O1xuICAgICAgYWxidW0uY29tbWVudHMucHVzaChjb21tZW50KTtcbiAgICAgIHJlcy5qc29uKHsgc3VjY2VzczogdHJ1ZSwgY29tbWVudHM6IGFsYnVtLmNvbW1lbnRzIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIkFsYnVtIG5vdCBmb3VuZFwiIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgaXNQcm9kdWN0aW9uID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiO1xuICBpZiAoIWlzUHJvZHVjdGlvbikge1xuICAgIGNvbnN0IHZpdGUgPSBhd2FpdCBjcmVhdGVWaXRlU2VydmVyKHtcbiAgICAgIHNlcnZlcjogeyBtaWRkbGV3YXJlTW9kZTogdHJ1ZSB9LFxuICAgICAgYXBwVHlwZTogJ3NwYSdcbiAgICB9KTtcbiAgICBhcHAudXNlKHZpdGUubWlkZGxld2FyZXMpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGRpc3RQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJkaXN0XCIpO1xuICAgIGFwcC51c2UoZXhwcmVzcy5zdGF0aWMoZGlzdFBhdGgpKTtcbiAgICBhcHAuZ2V0KFwiKlwiLCAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgIGlmIChyZXEucGF0aC5zdGFydHNXaXRoKFwiL2FwaVwiKSkgcmV0dXJuIG5leHQoKTtcbiAgICAgIHJlcy5zZW5kRmlsZShwYXRoLmpvaW4oZGlzdFBhdGgsIFwiaW5kZXguaHRtbFwiKSk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBQT1JUID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAwO1xuICBhcHAubGlzdGVuKE51bWJlcihQT1JUKSwgXCIwLjAuMC4wXCIsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgU2VydmVyIHJ1bm5pbmcgb24gcG9ydCAke1BPUlR9YCk7XG4gIH0pO1xufVxuXG5zdGFydFNlcnZlcigpO1xuIl0sImZpbGUiOiIvYXBwL2FwcGxldC9zZXJ2ZXIudHMifQ==