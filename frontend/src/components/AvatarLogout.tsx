import React, { useState } from "react";
import { Box, Button, Popover, Typography, Avatar } from "@mui/material";

interface AvatarLogoutProps {
    userName: string;
    onLogout: () => void;
}

const AvatarLogout: React.FC<AvatarLogoutProps> = ({ userName, onLogout }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openPopover = Boolean(anchorEl);
    const id = openPopover ? "user-popover" : undefined;

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ position: "absolute", top: 16, left: 16 }}>
            <Avatar onClick={handleAvatarClick} sx={{ cursor: "pointer", bgcolor: "primary.main" }}>
                {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Popover
                id={id}
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <Box sx={{ p: 2, minWidth: 200 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {userName}
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={onLogout} fullWidth>
                        Sair
                    </Button>
                </Box>
            </Popover>
        </Box>
    );
};

export default AvatarLogout;
