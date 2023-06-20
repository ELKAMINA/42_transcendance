import SimpleBarReact from 'simplebar-react';
import { styled, SxProps } from '@mui/system';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'scroll',
}));

const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
  // maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: '#dce1e6',
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
  "& .simplebar-placeholder": {
    height: '0 !important',
  }
}));

// ----------------------------------------------------------------------

// interface ScrollbarProps {
//   children: ReactNode;
//   sx?: SxProps;
//   timeout: number;
//   clickOnTrack?: boolean;
// }

// export default function Scrollbar({ children, sx, ...other }: ScrollbarProps) {
//   const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

//   const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

//   if (isMobile) {
//     return (
//       <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
//         {children}
//       </Box>
//     );
//   }

//   return (
//     <RootStyle>
//       <SimpleBarStyle clickOnTrack={false} sx={sx} {...other}>
//         {children}
//       </SimpleBarStyle>
//     </RootStyle>
//   );
// }

export { SimpleBarStyle };