import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
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
        sx={(theme)=> ({
            width: {
                xs: '80%',
                sm: '80%',
                md: '80%',
                lg: '80%',
            },
            height: {
                xs: '10%',
                sm: '10%',
                md: '10%',
                lg: '10%',
            },
            // overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            margin: 2,
            // alignItems: 'center',
            })}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    // alignContent: 'center',
                    justifyContent: "space-evenly",
                    // flex: "1",
                }}
            >
                <Typography component="div"
                    sx={(theme)=> ({
                        fontSize: {
                            xs: 11,
                            sm: 15,
                            md: 20,
                            lg: 25,
                        },

                    })}
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
                        sx={(theme)=> ({
                            fontSize: {
                                xs: 12,
                                sm: 15,
                                md: 20,
                                lg: 30,
                            },
                            color: "#07457E"
                        })}
                        color="text.secondary"
                        gutterBottom
                    >
                        {props.us.p1_score} - {props.us.p2_score}
                    </Typography>
                    <Typography component="div"
                        sx={(theme)=> ({
                            fontSize: {
                                xs: 10,
                                sm: 20,
                                md: 30,
                                lg: 10,
                            },
                            color: "#07457E",
                            font: "italic"
                        })}
                        color="text.secondary"
                        gutterBottom
                    >
                        {formattedDate}
                        {/* {Date.parse(props.us.createdAt.toString())} */}
                    </Typography>
                </Box>
                <Typography component="div"
                    sx={(theme)=> ({
                        fontSize: {
                            xs: 11,
                            sm: 15,
                            md: 20,
                            lg: 25,
                        },
                        color: "00FFFF" 
                    })}
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
