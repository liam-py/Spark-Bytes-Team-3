"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserSummary = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isOrganizer: boolean;
  createdAt: string;
  _count: { events: number; reservations: number; feedbacks: number };
};

type UserActivity = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isOrganizer: boolean;
  createdAt: string;
  events: { id: string; title: string; startTime: string; endTime: string }[];
  reservations: {
    id: string;
    status: string;
    reservedAt: string;
    event: { id: string; title: string; startTime: string; endTime: string } | null;
  }[];
};

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [actionMessage, setActionMessage] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/users`, { credentials: "include" });
      if (res.status === 401 || res.status === 403) {
        router.push("/");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load users");
      }
      const data = await res.json();
      setUsers(data);
      if (data.length && !selectedUserId) {
        loadUserActivity(data[0].id);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadUserActivity = async (userId: string) => {
    setSelectedUserId(userId);
    setDetailLoading(true);
    setActionMessage("");
    try {
      const res = await fetch(`${base}/api/users/${userId}`, {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load user activity");
      }
      const data = await res.json();
      setSelectedUser(data);
    } catch (e: any) {
      setError(e.message || "Failed to load user activity");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const confirmed = confirm(
      "Delete this user and all related data? This cannot be undone."
    );
    if (!confirmed) return;
    setActionMessage("");
    try {
      const res = await fetch(`${base}/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (selectedUserId === userId) {
        setSelectedUserId(null);
        setSelectedUser(null);
      }
      setActionMessage("User deleted");
    } catch (e: any) {
      setError(e.message || "Delete failed");
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    const confirmed = confirm("Delete this user's reservation?");
    if (!confirmed) return;
    setActionMessage("");
    try {
      const res = await fetch(`${base}/api/reservations/admin/${reservationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete reservation");
      }
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          reservations: selectedUser.reservations.filter((r) => r.id !== reservationId),
        });
      }
      setActionMessage("Reservation deleted");
    } catch (e: any) {
      setError(e.message || "Failed to delete reservation");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">User Management</Typography>
        <Button variant="outlined" onClick={fetchUsers} disabled={loading}>
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {actionMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {actionMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ overflowX: "auto" }}>
            <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Users</Typography>
              {loading && <CircularProgress size={20} />}
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name / Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Created Events</TableCell>
                  <TableCell align="right">Reservations</TableCell>
                  <TableCell align="center" sx={{ minWidth: 120, whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow
                    key={u.id}
                    hover
                    selected={u.id === selectedUserId}
                    onClick={() => loadUserActivity(u.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box>
                          <Typography variant="body2">
                            {u.name || u.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {u.email}
                          </Typography>
                        </Box>
                        {u.isOrganizer && <Chip size="small" label="Organizer" />}
                      </Box>
                    </TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell align="right">{u._count.events}</TableCell>
                    <TableCell align="right">{u._count.reservations}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(u.id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ minHeight: 420 }}>
            <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">User Details</Typography>
              {detailLoading && <CircularProgress size={20} />}
            </Box>
            <Divider />
            {selectedUser ? (
              <Box p={2}>
                <Typography variant="subtitle1">
                  {selectedUser.name || selectedUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser.email} · {selectedUser.role}
                </Typography>
                <Box mt={1}>
                  {selectedUser.isOrganizer && <Chip size="small" label="Organizer" sx={{ mr: 1 }} />}
                </Box>

                <Stack direction="row" spacing={2} mt={2}>
                  <Chip label={`Created events: ${selectedUser.events.length}`} />
                  <Chip label={`Reservations: ${selectedUser.reservations.length}`} />
                </Stack>

                <Box mt={3}>
                  <Typography variant="subtitle2">Created Events</Typography>
                  {selectedUser.events.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      None
                    </Typography>
                  ) : (
                    selectedUser.events.map((ev) => (
                      <Typography variant="body2" key={ev.id}>
                        {ev.title} · {new Date(ev.startTime).toLocaleString()}
                      </Typography>
                    ))
                  )}
                </Box>

                <Box mt={3}>
                  <Typography variant="subtitle2">Reservations</Typography>
                  {selectedUser.reservations.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      None
                    </Typography>
                  ) : (
                    selectedUser.reservations.map((r) => (
                      <Box
                        key={r.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mt={1}
                      >
                        <Box>
                          <Typography variant="body2">
                            {r.event?.title || "Deleted event"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(r.reservedAt).toLocaleString()} · {r.status}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteReservation(r.id)}
                        >
                          Delete reservation
                        </Button>
                      </Box>
                    ))
                  )}
                </Box>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    Delete user and data
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box p={2}>
                <Typography variant="body2" color="text.secondary">
                  Select a user to view details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
