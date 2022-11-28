import Head from "next/head";
// local
import Navbar from "./Navbar";
import Crumbs from "./Crumbs"
// mui
import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const Layout = ({children, title}) => (
    <Box sx={{minWidth: 320}}>
        <Head>
            <title>{title && "CafeReview " + title || "CafeReview"}</title>
        </Head>
        <style>{`
            img{ 
                max-width: 100%;
                max-height: 100%;
                object-fit: cover;
            } 
        `}</style>
        <Stack justifyContent={"space-between"} sx={{minHeight: "100vh"}} spacing={2}>
            <Box sx={{position: "sticky", top: 0, zIndex: 2}}>
                <Navbar/>
            </Box>
            <Crumbs/>
            <Box sx={{flexGrow: 1}}>
                <main>
                    <Container>
                        {children}
                    </Container>
                </main>
            </Box>
            <Box>
                <footer>
                    <Container>
                        <Typography variant="body2" color="text.secondary" textAlign="end" sx={{pb:2}}>
                            <Link color="inherit" href="https://github.com/sprudzans/cafereview">
                                code source
                            </Link>
                        </Typography>
                    </Container>
                </footer>
            </Box>
        </Stack>
    </Box>
)

export default Layout