import axios from "axios";
import NextLink from "next/link";
import {useState} from "react";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
// local
import {logoutUser} from "../utils/user/userSlice";
// mui
import Box from "@mui/material/Box"
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// icons
import TableBarIcon from '@mui/icons-material/TableBar';

const Navbar = () => {
    const user = useSelector(state => state.user)
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [show, setShow] = useState(false);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const dispatch = useDispatch()
    const router = useRouter();

    const handleLogout = () => {
        handleCloseUserMenu()
        setShow(true)

        axios
            .post('/api/user/logout', {}, {withCredentials: true})
            .then(_ => {
                dispatch(logoutUser());
                router.push('/')
            });
    }

    const UserMenu = () => {

        return (
            <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <NextLink href={"/user/"} passHref>
                    <MenuItem key={"Профиль"}>
                        <Typography textAlign="center">Профиль</Typography>
                    </MenuItem>
                </NextLink>
                <NextLink href={"/user/book"} passHref>
                    <MenuItem key={"История"}>
                        <Typography textAlign="center">История</Typography>
                    </MenuItem>
                </NextLink>
                <MenuItem key={"Выйти"}>
                    <Typography onClick={handleLogout} textAlign="center">Выйти</Typography>
                </MenuItem>
            </Menu>
        )
    }

    return (
        <AppBar position='static'>
            <Container>
                <Toolbar variant='dense' disableGutters>
                    <Box sx={{flexGrow: 1}}>
                        <NextLink href={"/"} passHref>
                            <Button variant="text" startIcon={<TableBarIcon/>} size="large" color={"secondary"}>
                                CafeReview
                            </Button>
                        </NextLink>
                    </Box>
                    {user.auth && (
                        <Box>
                            <Tooltip title={"Меню пользователя"}>
                                <IconButton onClick={handleOpenUserMenu}>
                                    <Avatar alt={user.username} src={user.avatar || ""}/>
                                </IconButton>
                            </Tooltip>
                            <UserMenu/>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={show}
                            >
                                <CircularProgress />
                            </Backdrop>
                        </Box>
                    )}

                    {!user.auth && (
                        <NextLink href={'/login'} passHref={true}>
                            <Button color="inherit">Войти</Button>
                        </NextLink>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar