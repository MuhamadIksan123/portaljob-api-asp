import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { useSendContactMutation } from "./contactApi";
import { useUserInfoQuery } from "../account/accountApi";

export default function ContactPage() {
  const { data: user } = useUserInfoQuery();
  const [sendContact, { isLoading }] = useSendContactMutation();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      toast.error("Subject and message are required.");
      return;
    }

    try {
      await sendContact({
        name,
        email: user?.email || "no-email@test.com",
        message,
      }).unwrap();

      toast.success("Message sent successfully.");

      setName("");
      setMessage("");
    } catch {
      toast.error("Failed to send message.");
    }
  };

  return (
    <>
      {/* Style khusus untuk mencerahkan placeholder input & textarea */}
      <style>{`
        .custom-dark-input::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>

      <main
        className="min-vh-100 pb-5 overflow-x-hidden position-relative d-flex flex-column justify-content-center align-items-center"
        style={{
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#0B0436",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 overflow-hidden"
          style={{ height: 700, zIndex: 0, pointerEvents: "none" }}
        >
          <img
            src="/assets/backgrounds/Group 2009.png"
            alt=""
            className="w-100 h-100"
            style={{ objectFit: "fill" }}
          />
        </div>

        <div
          className="container position-relative py-5"
          style={{ zIndex: 1, maxWidth: 650 }}
        >
          <div
            className="p-5 shadow-lg text-white"
            style={{
              backgroundColor: "#13084C",
              borderRadius: "32px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <h2 className="fw-bold mb-2" style={{ fontSize: "28px" }}>
              Contact Us
            </h2>
            <p className="text-white-50 mb-4" style={{ fontSize: "14px" }}>
              Have a question or feedback? Send your message to the JOBANK team.
            </p>

            <form onSubmit={submit}>
              {/* Subject */}
              <div className="mb-4">
                <label
                  className="form-label fw-semibold mb-2"
                  style={{ fontSize: "14px" }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control text-white shadow-none py-3 px-4 custom-dark-input"
                  placeholder="Enter subject..."
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  style={{
                    backgroundColor: "#0B0436",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label
                  className="form-label fw-semibold mb-2"
                  style={{ fontSize: "14px" }}
                >
                  Message
                </label>
                <textarea
                  className="form-control text-white shadow-none p-4 custom-dark-input"
                  rows={5}
                  placeholder="Write your message..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  style={{
                    backgroundColor: "#0B0436",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "16px",
                    fontSize: "14px",
                    resize: "none",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn text-white fw-semibold py-3 rounded-pill shadow-sm"
                disabled={isLoading}
                style={{
                  backgroundColor: "#FF6B35",
                  borderColor: "#FF6B35",
                  fontSize: "15px",
                  width: "100%",
                }}
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
