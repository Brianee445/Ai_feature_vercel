import { useNavigate, useLocation } from "react-router-dom"
import { Home, Search, MessageCircle, User } from "lucide-react"

function BottomNav() {
  const navigate = useNavigate()
    const location = useLocation()

      const tabs = [
          { icon: Home, label: "Home", path: "/" },
              { icon: Search, label: "Search", path: "/demo" },
                  { icon: MessageCircle, label: "Assistant", path: "/demo?tab=chat" },
                      { icon: User, label: "Account", path: "/account" },
                        ]

                          return (
                              <nav
                                    className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white"
                                          style={{ borderColor: "var(--border-color)", boxShadow: "0 -1px 5px rgba(0,0,0,0.08)" }}
                                              >
                                                    {tabs.map(({ icon: Icon, label, path }) => {
                                                            const isActive = location.pathname + location.search === path ||
                                                                      (path === "/" && location.pathname === "/")

                                                                              return (
                                                                                        <button
                                                                                                    key={label}
                                                                                                                onClick={() => navigate(path)}
                                                                                                                            className="flex flex-col items-center justify-center flex-1 py-3 gap-1"
                                                                                                                                        style={{ color: isActive ? "var(--accent-color)" : "var(--text-color-2)" }}
                                                                                                                                                  >
                                                                                                                                                              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                                                                                                                                                                          <span className="text-xs font-medium">{label}</span>
                                                                                                                                                                                    </button>
                                                                                                                                                                                            )
                                                                                                                                                                                                  })}
                                                                                                                                                                                                      </nav>
                                                                                                                                                                                                        )
                                                                                                                                                                                                        }

                                                                                                                                                                                                        export default BottomNav