"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/navigation";
import AdminUserTable from "@/components/admin/AdminUserTable";
import AdminUserDetailsPanel from "@/components/admin/AdminUserDetails";
import { AdminUserDetails, AdminUserSummary } from "@/components/admin/types";
import { useAuth } from "@/app/providers/AuthProvider";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<AdminUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/admin/users`, { credentials: "include" });
      if (res.status === 401 || res.status === 403) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load users");
      }
      setUsers(data);
      if (selectedUserId && !data.find((u: AdminUserSummary) => u.id === selectedUserId)) {
        setSelectedUserId(null);
        setSelectedUserDetails(null);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setDetailsLoading(true);
    setDetailsError("");
    try {
      const res = await fetch(`${base}/api/admin/users/${userId}/details`, {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load user details");
      }
      setSelectedUserDetails(data);
    } catch (e: any) {
      setDetailsError(e?.message || "Failed to load user details");
      setSelectedUserDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setSelectedUserDetails(null);
    fetchUserDetails(userId);
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmDeleteId(userId);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setActionLoading(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/admin/users/${confirmDeleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u.id !== confirmDeleteId));
      if (selectedUserId === confirmDeleteId) {
        setSelectedUserId(null);
        setSelectedUserDetails(null);
      }
      setConfirmDeleteId(null);
    } catch (e: any) {
      setError(e?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDeleteId(null);
  };

  if (loading && users.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          User Management
        </Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchUsers}>
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <AdminUserTable
            users={users}
            selectedUserId={selectedUserId}
            onSelect={handleSelectUser}
            onDelete={handleDeleteUser}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <AdminUserDetailsPanel
            user={selectedUserDetails}
            loading={detailsLoading}
            error={detailsError}
          />
        </Grid>
      </Grid>

      <Dialog open={!!confirmDeleteId} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will delete the user and all their events and reservations. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button color="error" onClick={handleConfirmDelete} disabled={actionLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
