import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "material-ui/styles/typography";
import { socket } from "../../pages/game";
import Navbar from "../../components/NavBar";


export default function Settings() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
    const [open, setOpen] = useState(true);
    const currentRoute = window.location.pathname;



    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div>
            <Navbar currentRoute={currentRoute} />
            <Dialog fullScreen={fullScreen} open={open} onClose={handleCancel}>
                <DialogTitle>
                        Win/Lose
                </DialogTitle>
                <DialogContent>
                    Score
                </DialogContent>
            </Dialog>
        </div>
    );
}
