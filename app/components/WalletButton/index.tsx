import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useReadContract } from 'wagmi'
import Link from 'next/link';
import { config, GigBlocksAbi, GIGBLOCKS_ADDRESS } from '@/app/config'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BASE_URL } from '@/app/config'

function useProfile(address: string) {
  return useQuery({
    queryKey: ['profile', address],
    queryFn: async () => {
      if (!address) return null
      const response = await axios.get(`${BASE_URL}/profiles/${address}`)
      return response.data
    },
    enabled: !!address
  })
}

function useGetENS() {
  const [username, setUsername] = useLocalStorage("username");
  const [walletAddress, setWalletAddress] = useLocalStorage("wallet_address");
  const [isEnsVerified, setIsEnsVerified] = useLocalStorage("is_ens_verified");

  return useQuery({
    queryKey: ["getENS", username, walletAddress],
    queryFn: async () => {
      const response = await axios.get(
        BASE_URL + "/ens/scroll?ensScrollName=" + username
      );
      if (response.status !== 200) {
        throw new Error("Error fetching data");
      }
      const ensScrollWalletAddress = response.data.ensScrollWalletAddress;
      if (ensScrollWalletAddress === walletAddress) {
        setIsEnsVerified("true");
      }
      return response.data;
    },
    staleTime: Infinity,
    enabled: !!username && !!walletAddress,
  });
}

function useLocalStorage(key: string, initialValue: string | null = null) {
  const [value, setValue] = useState<string | null>(initialValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      setValue(storedValue);
    }
  }, [key]);

  const setStoredValue = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, newValue);
    }
  };

  return [value, setStoredValue] as const;
}

export default function WalletButton({
  registerSession,
}: Readonly<{ registerSession: boolean }>) {
  const { data: ethData, refetch: refetchENS } = useGetENS();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useLocalStorage("username");
  const [walletAddress, setWalletAddress] = useLocalStorage("wallet_address");
  const [isEnsVerified, setIsEnsVerified] = useLocalStorage("is_ens_verified");
  const [hasShownModal, setHasShownModal] = useLocalStorage(
    "hasShownRegistrationModal"
  );
  const [openModal, setOpenModal] = useState(false);
  const { disconnect } = useDisconnect();
  const account = useAccount({
    config,
  });
  const handleDisconnect = () => {
    disconnect()
    // Reset localStorage
    setUsername(null)
    setWalletAddress(null)
    setIsEnsVerified(null)
    setHasShownModal(null)
    localStorage.removeItem('username')
    localStorage.removeItem('wallet_address')
    localStorage.removeItem('is_ens_verified')
    localStorage.removeItem('role')
    localStorage.removeItem('hasShownRegistrationModal')
    setDisplayName("")
    // Force a re-render or update of the component
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const result = useReadContract({
    abi: GigBlocksAbi,
    address: GIGBLOCKS_ADDRESS,
    functionName: "isRegistered",
    args: [account.address],
  });

  const { data: profileData } = useProfile(account.address as string)

  useEffect(() => {
    if (account.isConnected) {
      setWalletAddress(account.address || null);
      refetchENS();
    }
  }, [account.isConnected, account.address, setWalletAddress, refetchENS]);

  useEffect(() => {
    if (
      account.isConnected &&
      result.data === false &&
      hasShownModal !== "true"
    ) {
      setOpenModal(true);
      setHasShownModal("true");
    }
  }, [account.isConnected, result.data, hasShownModal, setHasShownModal]);

  useEffect(() => {
    if (isEnsVerified === 'true' && username) {
      setDisplayName(`${username}.gigblocks.eth`);
    } else if (account.address) {
      setDisplayName(`${account.address.slice(0, 6)}...${account.address.slice(-4)}`);
    }
  }, [isEnsVerified, username, account.address]);

  useEffect(() => {
    if (account.isConnected && result.data === true && profileData) {
      localStorage.setItem('username', profileData.profileDetail.username);
      localStorage.setItem('role', profileData.flags);
      localStorage.setItem('wallet_address', account.address as string);
    }
  }, [account.isConnected, result.data, profileData]);

  const handleCloseModal = () => setOpenModal(false);

  if (!account.isConnected) {
    return <w3m-button size="md" />;
  }

  return (
    <>
      <div className="relative inline-block text-left dropdown">
        <button
          type="button"
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
         {displayName}
        </button>
        <div className="dropdown-content origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          <div className="py-1">
            {result.data === true && (
              <Link
                href="/myprofile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Profile
              </Link>
            )}
            <button
              onClick={handleDisconnect}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="registration-modal"
        aria-describedby="modal-to-encourage-registration"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#2E7D32" }}
          >
            Welcome to GigBlocks! 🚀
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, mb: 4, color: "#555" }}
          >
            We're excited to have you here! Join our community to unlock all
            features and embark on your blockchain journey.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              backgroundColor: "#2E7D32",
              "&:hover": {
                backgroundColor: "#1B5E20",
              },
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
              py: 1.5,
              mb: 2,
            }}
            onClick={() => {
              handleCloseModal();
              window.location.href = "/register";
            }}
          >
            Register Now
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            sx={{
              borderColor: "#2E7D32",
              color: "#2E7D32",
              "&:hover": {
                borderColor: "#1B5E20",
                backgroundColor: "rgba(46, 125, 50, 0.04)",
              },
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "medium",
              py: 1.5,
            }}
            onClick={handleCloseModal}
          >
            View App First
          </Button>
        </Box>
      </Modal>
    </>
  );
}
