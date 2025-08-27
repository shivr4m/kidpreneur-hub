import { useState, useEffect } from "react";

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({
    name: "",
    title: "",
    problem: "",
    solution: "",
    category: "",
    image: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [adminLogged, setAdminLogged] = useState(false);

  // 🎨 Fixed pastel theme + dark mode toggle
  const [darkMode, setDarkMode] = useState(false);

  const theme = darkMode
    ? {
        bgColor: "#222", // dark background
        cardColor: "#333",
        buttonColor: "#ff6f61",
        sidebarColor: "#444",
        textColor: "white",
      }
    : {
        bgColor: "#f9e2e7", // pastel pink
        cardColor: "#ffd966", // pastel yellow
        buttonColor: "#6ecb63", // green
        sidebarColor: "#8ecae6", // pastel blue
        textColor: "#222",
      };

  // Sorting option
  const [sortOrder, setSortOrder] = useState("newest");

  // Load ideas & settings
  useEffect(() => {
    const saved = localStorage.getItem("kidIdeas");
    if (saved) setIdeas(JSON.parse(saved));

    const savedDark = localStorage.getItem("darkMode");
    if (savedDark) setDarkMode(JSON.parse(savedDark));

    const savedSort = localStorage.getItem("sortOrder");
    if (savedSort) setSortOrder(savedSort);
  }, []);

  // Save ideas + settings
  useEffect(() => {
    localStorage.setItem("kidIdeas", JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("sortOrder", sortOrder);
  }, [sortOrder]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.problem || !form.solution) return;

    const newIdea = { ...form, id: Date.now() };
    setIdeas([newIdea, ...ideas]);
    setForm({ name: "", title: "", problem: "", solution: "", category: "", image: "" });
  };

  // Admin login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (form.name === "shivr4m" && form.solution === "Password12345") {
      setAdminLogged(true);
    } else {
      alert("Wrong username or password!");
    }
  };

  // 🔧 Settings functionality
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const resetIdeas = () => {
    if (window.confirm("Are you sure you want to delete all ideas?")) {
      setIdeas([]);
      localStorage.removeItem("kidIdeas");
    }
  };

  const sortedIdeas = [...ideas].sort((a, b) => {
    if (sortOrder === "newest") return b.id - a.id;
    if (sortOrder === "oldest") return a.id - b.id;
    return 0;
  });

  return (
    <div 
      style={{ 
        display: "flex", 
        flexDirection: "column",
        width: "100vw",   
        height: "100vh",  
        fontFamily: "'Comic Neue', cursive",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        color: theme.textColor,
      }}
    >
      {/* 🔝 Top Menu */}
      <div style={{
        background: "#ffb703",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "18px",
      }}>
        <span>🌈 Kidpreneur Hub</span>
        <div>
          {["home", "create", "settings", "admin"].map((page) => (
            <button 
              key={page}
              onClick={() => setActivePage(page)}
              style={{
                marginLeft: "10px",
                padding: "8px 14px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: activePage === page ? "#d62828" : "white",
                color: activePage === page ? "white" : "#333",
              }}
            >
              {page.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: sidebarOpen ? 220 : 60,
            background: theme.sidebarColor,
            color: "#222",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: sidebarOpen ? "flex-start" : "center",
            transition: "width 0.5s ease"
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            {sidebarOpen ? "⬅️" : "➡️"}
          </button>

          {["home", "create", "settings", "admin"].map((page) => (
            <div
              key={page}
              onClick={() => setActivePage(page)}
              style={{
                margin: "10px 0",
                padding: "10px",
                width: "100%",
                borderRadius: "12px",
                cursor: "pointer",
                background: activePage === page ? "#ffb703" : "transparent",
                textAlign: sidebarOpen ? "left" : "center",
                fontWeight: activePage === page ? "bold" : "normal",
              }}
            >
              {sidebarOpen ? `⭐ ${page.toUpperCase()}` : "⭐"}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, background: theme.bgColor, padding: "20px", overflowY: "auto" }}>
          {activePage === "home" && (
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <h1 style={{ color: "#ff6f61", textAlign: "center", marginBottom: "10px" }}>
                🌈 Kidpreneur Hub
              </h1>
              <p style={{ textAlign: "center", marginBottom: "30px" }}>
                Share fun startup ideas and inspire others!
              </p>

              {sortedIdeas.length === 0 ? (
                <p style={{ textAlign: "center", color: "#777" }}>
                  No ideas yet. Be the first to submit!
                </p>
              ) : (
                sortedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    style={{
                      background: theme.cardColor,
                      padding: "20px",
                      marginBottom: "20px",
                      borderRadius: "15px",
                      textAlign: "left",
                      color: theme.textColor,
                    }}
                  >
                    <h2 style={{ color: "#d62828", marginBottom: "5px" }}>{idea.title}</h2>
                    {idea.name && <p style={{ margin: "4px 0" }}>👦 <strong>By:</strong> {idea.name}</p>}
                    {idea.category && <p style={{ margin: "4px 0" }}>📌 <strong>Category:</strong> {idea.category}</p>}
                    <p style={{ margin: "6px 0" }}><strong>Problem:</strong> {idea.problem}</p>
                    <p style={{ margin: "6px 0" }}><strong>Solution:</strong> {idea.solution}</p>
                    {idea.image && (
                      <img 
                        src={idea.image} 
                        alt="Idea" 
                        style={{ maxWidth: "100%", borderRadius: "12px", marginTop: "10px" }} 
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activePage === "create" && (
            <form
              onSubmit={handleSubmit}
              style={{
                maxWidth: "500px",
                margin: "0 auto",
                padding: "20px",
                background: theme.cardColor,
                borderRadius: "15px",
                textAlign: "left",
                color: theme.textColor,
              }}
            >
              <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
                ✏️ Submit Your Idea
              </h2>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" style={{ width: "100%", padding: "10px", margin: "8px 0" }} />
              <input name="title" value={form.title} onChange={handleChange} placeholder="Idea Title" required style={{ width: "100%", padding: "10px", margin: "8px 0" }} />
              <select name="category" value={form.category} onChange={handleChange} style={{ width: "100%", padding: "10px", margin: "8px 0" }}>
                <option value="">Choose Category</option>
                <option>Tech</option>
                <option>Education</option>
                <option>Environment</option>
                <option>Fun</option>
              </select>
              <textarea name="problem" value={form.problem} onChange={handleChange} placeholder="What's the problem?" required style={{ width: "100%", padding: "10px", margin: "8px 0", minHeight: "80px" }} />
              <textarea name="solution" value={form.solution} onChange={handleChange} placeholder="What's your solution?" required style={{ width: "100%", padding: "10px", margin: "8px 0", minHeight: "80px" }} />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ margin: "10px 0" }} />
              <button type="submit" style={{ width: "100%", padding: "12px", background: theme.buttonColor, color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px" }}>🚀 Submit</button>
            </form>
          )}

          {activePage === "settings" && (
            <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
              <h2 style={{ textAlign: "center" }}>⚙️ Settings</h2>
              
              {/* Dark mode toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={toggleDarkMode} 
                  />{" "}
                  🌙 Dark Mode
                </label>
              </div>

              {/* Sort order */}
              <div style={{ marginBottom: "20px" }}>
                <label>🔀 Sort Ideas: </label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: "10px", padding: "5px" }}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Reset ideas */}
              <div>
                <button 
                  onClick={resetIdeas} 
                  style={{ padding: "10px 20px", background: "#d62828", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                >
                  🗑 Reset All Ideas
                </button>
              </div>
            </div>
          )}

          {activePage === "admin" && (
            <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
              {!adminLogged ? (
                <form onSubmit={handleAdminLogin} style={{ background: theme.cardColor, padding: "20px", borderRadius: "15px", textAlign: "left" }}>
                  <h2 style={{ textAlign: "center", marginBottom: "15px" }}>🔑 Admin Login</h2>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Username" style={{ width: "100%", padding: "10px", margin: "8px 0" }} />
                  <input type="password" name="solution" value={form.solution} onChange={handleChange} placeholder="Password" style={{ width: "100%", padding: "10px", margin: "8px 0" }} />
                  <button type="submit" style={{ width: "100%", padding: "12px", background: "#ff6f61", color: "white", border: "none", borderRadius: "10px", fontSize: "16px" }}>Login</button>
                </form>
              ) : (
                <div>
                  <h2>🛠 Admin Panel</h2>
                  <p>You can manage ideas here in the future.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}