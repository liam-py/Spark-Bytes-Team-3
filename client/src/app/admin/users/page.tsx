"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type UserSummary = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdEventsCount: number;
  reservationsCount: number;
};

type UserDetails = UserSummary & {
  createdEvents: { id: string; title: string }[];
  reservations: {
    id: string;
    eventId: string;
    eventTitle: string;
    status?: string;
    reservedAt?: string;
  }[];
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [authChecking, setAuthChecking] = useState(true);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState("");

  const checkAdmin = async () => {
    try {
      const res = await fetch(`${base}/auth/me`, { credentials: "include" });
      const data = await res.json();
      if (data?.user?.role !== "ADMIN") {
        router.push("/admin/login");
        return;
      }
      await fetchUsers();
    } catch {
      router.push("/admin/login");
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchUsers = async (refreshDetails?: boolean) => {
    setListLoading(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/admin/users`, {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }
      const data: UserSummary[] = await res.json();
      setUsers(data);

      let nextSelectedId: string | null = null;
      const previousSelectedId = selectedUserId;
      setSelectedUserId((current) => {
        if (!data.length) {
          return null;
        }
        const stillExists = current && data.some((user) => user.id === current);
        nextSelectedId = stillExists ? (current as string) : data[0].id;
        return nextSelectedId;
      });

      if (!data.length) {
        setSelectedUser(null);
      } else if (refreshDetails && nextSelectedId && previousSelectedId === nextSelectedId) {
        await fetchUserDetails(nextSelectedId);
      }
    } catch {
      setError("Failed to load users");
      setUsers([]);
      setSelectedUser(null);
      setSelectedUserId(null);
    } finally {
      setListLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setDetailsLoading(true);
    setDetailsError("");
    try {
      const res = await fetch(`${base}/api/admin/users/${userId}`, {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }
      if (res.status === 404) {
        setDetailsError("User not found");
        setSelectedUser(null);
        return;
      }
      const data: UserDetails = await res.json();
      setSelectedUser(data);
    } catch {
      setDetailsError("Failed to load user details");
      setSelectedUser(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserDetails(selectedUserId);
    } else {
      setSelectedUser(null);
    }
  }, [selectedUserId]);

  const openDeleteDialog = (userId: string) => {
    setPendingDeleteId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/admin/users/${pendingDeleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete user");
        return;
      }
      setSnackbar("User deleted");
      setSelectedUserId((current) =>
        current === pendingDeleteId ? null : current
      );
      setSelectedUser(null);
      await fetchUsers(true);
    } catch {
      setError("Failed to delete user");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
    }
  };

  if (authChecking) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          User Management
        </Typography>
        <Button
          variant="outlined"
          onClick={() => fetchUsers(true)}
          disabled={listLoading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Users
              </Typography>

              {listLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : users.length === 0 ? (
                <Alert severity="info">No users found</Alert>
              ) : (
                <Table size="small" sx={{ tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name / Email</TableCell>
                      <TableCell sx={{ width: 120 }}>Role</TableCell>
                      <TableCell align="center">Created Events</TableCell>
                      <TableCell align="center">Reservations</TableCell>
                      <TableCell sx={{ width: 120 }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        hover
                        selected={selectedUserId === user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        sx={{ cursor: "pointer", "& > td": { py: 1.2 } }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {user.name || user.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontSize={13}>
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 120, whiteSpace: "nowrap" }}>
                          <Chip
                            label={user.role}
                            size="small"
                            color={user.role === "ADMIN" ? "primary" : "default"}
                            variant="outlined"
                            sx={{
                              fontSize: 12,
                              py: 0,
                              px: 1.25,
                              maxWidth: 90,
                              whiteSpace: "nowrap",
                              height: "24px",
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">{user.createdEventsCount}</TableCell>
                        <TableCell align="center">{user.reservationsCount}</TableCell>
                        <TableCell align="right" sx={{ width: 120, whiteSpace: "nowrap" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(user.id);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                User Details
              </Typography>

              {detailsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1, alignItems: "center" }}>
                  <CircularProgress />
                </Box>
              ) : !selectedUser ? (
                <Typography variant="body2" color="text.secondary">
                  Select a user from the list to view details.
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
                  {detailsError && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      {detailsError}
                    </Alert>
                  )}

                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {selectedUser.name || selectedUser.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                  <Chip
                    label={selectedUser.role}
                    size="small"
                    color={selectedUser.role === "ADMIN" ? "primary" : "default"}
                    sx={{ width: "fit-content", mt: 1 }}
                  />

                  <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                    <Chip
                      label={`Created events: ${selectedUser.createdEventsCount}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Reservations: ${selectedUser.reservationsCount}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Created Events
                    </Typography>
                    {selectedUser.createdEvents.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    ) : (
                      selectedUser.createdEvents.map((event) => (
                        <Box key={event.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          <Link href={`/events/${event.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
                              {event.title}
                            </Typography>
                          </Link>
                        </Box>
                      ))
                    )}
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Reservations
                    </Typography>
                    {selectedUser.reservations.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        None
                      </Typography>
                    ) : (
                      selectedUser.reservations.map((reservation) => (
                        <Box key={reservation.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          <Link
                            href={`/events/${reservation.eventId}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
                              {reservation.eventTitle}
                            </Typography>
                          </Link>
                          {reservation.status && (
                            <Chip
                              label={reservation.status}
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: "capitalize" }}
                            />
                          )}
                        </Box>
                      ))
                    )}
                  </Box>

                  <Box sx={{ mt: "auto", pt: 2 }}>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={() => openDeleteDialog(selectedUser.id)}
                    >
                      Delete user and data
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => (!deleting ? setDeleteDialogOpen(false) : null)}
      >
        <DialogTitle>Delete user and data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure? This will delete the user and all their events, reservations, and feedback.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar("")}
        message={snackbar}
      />
    </Container>
  );
}
