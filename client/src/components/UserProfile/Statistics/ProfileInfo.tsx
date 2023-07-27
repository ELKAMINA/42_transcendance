import * as React from "react";
// import SwipeableViews from 'react-swipeable-views';
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Statistics from "./Skeleton";
import { Rank, Wins, Loss, TotalMatches, Level } from "./Scores";
import MatchHistory from "../Events/Skeleton";
import { UserModel } from "../../../types/users/userType";

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

interface Myprops {
    interestProfile: UserModel;
}

export default function ProfileInfo(props: Myprops) {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const matches = props.interestProfile.p1
        .concat(props.interestProfile.p2)
        .filter(
            (v, i, a) => a.findIndex((t) => t.match_id === v.match_id) === i
        )
        .sort(
            (a, b) =>
                Date.parse(b.createdAt.toString()) -
                Date.parse(a.createdAt.toString())
        );
    // console.log("login  ", props.interestProfile.login);
    console.log("tous lesmatches ", matches);
    // console.log("les p1 ", props.interestProfile.p1);
    return (
        <Box sx={{ bgcolor: "background.paper", width: "90vw" }}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab
                        label="Statistics"
                        {...a11yProps(0)}
                        sx={{ backgroundColor: "#07457E" }}
                    />
                    <Tab
                        label="Matches History"
                        {...a11yProps(1)}
                        sx={{ backgroundColor: "#07457E" }}
                    />
                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0} dir={theme.direction}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Rank him={props.interestProfile} />
                    <Wins him={props.interestProfile} />
                    <Loss him={props.interestProfile} />
                    <TotalMatches him={props.interestProfile} />
                    <Level him={props.interestProfile} />
                </Box>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
                {/* remplacer par le tableau de match joués et recuperer les infos */}
                {matches.map((e: any) => (
                    <MatchHistory us={e} />
                ))}
            </TabPanel>
        </Box>
    );
}
