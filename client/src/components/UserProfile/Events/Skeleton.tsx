import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { Match } from "../../../types/match";

interface Myprops {
    us: Match;
}

const MatchHistory = (props: Myprops) => {
    let dateStr = props.us.createdAt;
    let date = new Date(dateStr);

    let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    // console.log(formatedDate); // Outputs: 2023-07-27
    React.useEffect(() => {}, []);
    return (
        <Card
            sx={{
                width: "80vw",
                height: "10vh",
                display: "flex",
                alignContent: "center",
                // flexDirection: 'row',
                // justifyContent: 'space-around',
                margin: "20px",
                borderRadius: "20px",
                // alignItems: 'center',
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    // alignContent: 'center',
                    justifyContent: "space-around",
                    flex: "1",
                }}
            >
                <Typography component="div"
                    sx={{ fontSize: 30, color: "00FFFF" }}
                    color="text.secondary"
                    gutterBottom
                >
                    {props.us.player1Id}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="div"
                        sx={{ fontSize: 30, color: "#07457E" }}
                        color="text.secondary"
                        gutterBottom
                    >
                        {props.us.p1_score} - {props.us.p2_score}
                    </Typography>
                    <Typography component="div"
                        sx={{ fontSize: 12, color: "#07457E", font: "italic" }}
                        color="text.secondary"
                        gutterBottom
                    >
                        {formattedDate}
                        {/* {Date.parse(props.us.createdAt.toString())} */}
                    </Typography>
                </Box>
                <Typography component="div"
                    sx={{ fontSize: 30, color: "00FFFF" }}
                    color="text.secondary"
                    gutterBottom
                >
                    {props.us.player2Id}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MatchHistory;
