import NextLink from "next/link";
import {useRouter} from "next/router";
// mui
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh"
}

const Error404 = () => {
    const router = useRouter()
    const handleClick = () => router.back()

    return (
        <Container>
            <Box sx={style}>
                <Stack spacing={2}>
                    <Typography>Этой страницы не существует</Typography>
                    <Typography>Вы можете вернуться на главную страницу</Typography>
                    <Box sx={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                        <Button onClick={handleClick}>
                            Назад
                        </Button>
                        <Typography>
                            <NextLink href={'/'} passHref>
                                <Link>На главную</Link>
                            </NextLink>
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Container>
    )
}

export default Error404