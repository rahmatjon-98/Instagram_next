import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Send } from 'lucide-react';
import { useUserId } from '@/hook/useUserId';
import { useUserStore } from '@/store/pages/explore/explorestore';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ModalUsers() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let { user, fechUser, getUsers } = useUserStore()
    let userId=useUserId()
      React.useEffect(() => {
        if (userId) {
            getUsers(userId);
        }
    }, [userId]);

    return (
        <div>
                    <Send size={30} color="#ffffff" />
            {/* <Button onClick={handleOpen}>
            </Button> */}
            {/* <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                     <div>
                        {user?.data?.map(el => (
                                <div key={el.userId}>
                                    <p>{el.userName}</p>
                                    <p>{el.fullname}</p>
                                </div>
                            ))}
                     </div>
                    </Box>
                </Fade>
            </Modal> */}
        </div>
    );
}
