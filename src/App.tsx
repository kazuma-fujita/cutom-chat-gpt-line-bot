import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import "./App.css";

interface MessageProps {
  text: string;
  sender: "user" | "ai";
}

interface ApiResponse {
  message: string;
  sessionId: string;
}

async function postData(value: string, sid: string): Promise<ApiResponse> {
  const response = await fetch(
    "https://at5ub5p3ak.execute-api.ap-northeast-1.amazonaws.com/nakamura/v1/chat/bot/message/reply",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userPromptText: value, sessionId: sid }),
    }
  );
  // ステータスコードのチェック
  if (!response.ok) {
    console.error(
      `Error posting data: ${response.status} ${response.statusText}`
    );
    // エラーレスポンス
    return {
      message:
        "サーバーにエラーが発生しました。時間をおいて再度お試しください。",
      sessionId: sid,
    };
  }
  return response.json();
}

function Message({ text, sender }: MessageProps) {
  return (
    <Grow in={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: sender === "ai" ? "row" : "row-reverse",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <Avatar>{sender === "user" ? <PersonIcon /> : <SmartToyIcon />}</Avatar>
        <Box
          sx={{
            backgroundColor: sender === "user" ? "primary.main" : "white",
            borderRadius:
              sender === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
            padding: 1,
            paddingLeft: 2,
            paddingRight: 2,
            marginLeft: 1,
            marginRight: 1,
            color: sender === "user" ? "white" : "grey.600",
            boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography>{text}</Typography>
        </Box>
      </Box>
    </Grow>
  );
}

function App() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: "user" },
    ]);

    try {
      const response = await postData(inputValue, sessionId);
      setSessionId(response.sessionId);
      console.log("response: ", response);
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.message, sender: "ai" },
      ]);
      setInputValue("");
    } catch (error) {
      console.error("Error posting data:", error);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box
        ref={messagesRef}
        sx={{
          flexGrow: 1,
          backgroundColor: "grey.200",
          padding: 2,
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 1,
            }}
          >
            <Avatar>
              <SmartToyIcon />
            </Avatar>
            <Box
              className="bounce"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: 1,
                marginRight: 1,
                width: 40,
                backgroundColor: "white",
                padding: 1,
                paddingLeft: 2,
                paddingRight: 2,
                borderRadius: "16px 16px 16px 0",
              }}
            >
              <Box className="dot" />
              <Box className="dot" />
              <Box className="dot" />
            </Box>
          </Box>
        )}
      </Box>
      <Box
        component="form"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          padding: 2,
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="メッセージを入力..."
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          InputProps={{
            style: {
              backgroundColor: "whitesmoke",
              borderRadius: "20px",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "whitesmoke",
              },
              "&:hover fieldset": {
                borderColor: "lightgray", // ホバー時のborder色をグレーに変更
              },
            },
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          sx={{ marginLeft: 1 }}
          disabled={loading || inputValue.trim() === ""}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default App;
