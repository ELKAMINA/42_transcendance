import { CardContent, Typography, Card, CardMedia } from "@mui/material";

export type GifViewerProps = {
	pathToGif : string,
	description? : string,
}
export default function GifViewer({pathToGif, description} : GifViewerProps) {
	return (
		<Card>
			<CardMedia
				component="img"
				alt="GIF"
				height="500"
				image={pathToGif}
			/>
			{description && 
				<CardContent>
					<Typography variant="body2" color="textSecondary" component="p">
						{description}
					</Typography>
				</CardContent>
			}
		</Card>
	);
};
  