import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
	useToast,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsersQuery, useLogoutMutation } from "../../slicers/usersApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../slicers/authSlice";
import ProfileModel from "./ProfileModel";

const Header = () => {
	const { userInfo } = useSelector((state) => state.auth);
  const { keyword: urlKeyword } = useParams()
  const { data, isLoading, error } = useGetUsersQuery(urlKeyword);
  // const { data } = useGetUsersQuery(urlKeyword)
  
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const toast = useToast();
  
	const [search, setSearch] = useState(urlKeyword || "");

	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	const [logoutApiCall] = useLogoutMutation();

	const logoutHandler = async () => {
		try {
			await logoutApiCall().unwrap();
			dispatch(logout());
			navigate("/");
			toast({
				title: "Logout Successful",
				description: "You have been logged out successfully!",
				status: "success"
			});
		} catch (err) {
			toast({
				title: "Error Occoured",
				description: `Unable to complete the log out due to the error below-\n${err}`,
				status: "error",
				isClosable: true,
			});
		}
	};

  const handleSearch = async ()=>{
    if(search.length < 3){
      toast({title :"Please enter at least 3 letters to search", status: "warning", position: "top-left" })
      return;
    }

    try {
      if(search.trim()){
        console.log(urlKeyword);
        navigate(`/search/${search}`)
        console.log(data);
        // console.log(urlKeyword);
        
      }else{
        navigate("/")
      }
    } catch (err) {
      
    }
  }

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				background="white"
				padding="1% 2%"
				borderWidth="2%"
			>
				<Tooltip label="Search for an user" hasArrow placement="bottom-end">
					<Button variant="ghost" onClick={onOpen} ref={btnRef}>
						<i
							className="fa-solid fa-magnifying-glass"
							style={{ color: "#74C0FC" }}
						/>
						<Text display={{ base: "none", md: "flex" }} my="auto" px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize="2xl" my="auto" px={4}>
					<b>Tick-n-Talk</b>
				</Text>
				<div>
					<Menu>
						<MenuButton padding={1}>
							<BellIcon />
						</MenuButton>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size="sm"
								cursor="pointer"
								name={userInfo.name}
								src={userInfo.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModel userInfo={userInfo}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModel>
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>
			<Drawer
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottom="1px">Search User</DrawerHeader>
					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
              <Button onClick={handleSearch}>
                <Search2Icon />
              </Button>
						</Box>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default Header;
