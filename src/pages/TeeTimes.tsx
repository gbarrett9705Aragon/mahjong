import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, UserPlus, UserMinus, Users, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, parse } from "date-fns";

interface Player {
  id: string;
  first_name: string;
  last_name: string;
  handicap: number | null;
  member_type: 'regular' | 'sub';
}

interface SignupPlayer extends Player {
  subbing_for?: Player | null;
}

interface TeeTime {
  id: string;
  date: string;
  time: string;
  course: string;
  created_at: string;
  signups?: SignupPlayer[];
}

const TeeTimes = () => {
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeeTime, setSelectedTeeTime] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [subbingForId, setSubbingForId] = useState<string>("");

  const regularMembers = players.filter(p => p.member_type === 'regular');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchTeeTimes(), fetchPlayers()]);
    setLoading(false);
  };

  const fetchTeeTimes = async () => {
    // Fetch tee times
    const { data: teeTimesData, error: teeTimesError } = await supabase
      .from("tee_times")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (teeTimesError) {
      console.error("Error fetching tee times:", teeTimesError);
      return;
    }

    // Fetch signups with player details for all tee times
    const { data: signupsData, error: signupsError } = await supabase
      .from("tee_time_signups")
      .select(`
        tee_time_id,
        subbing_for_player_id,
        players (
          id,
          first_name,
          last_name,
          handicap,
          member_type
        ),
        subbing_for:subbing_for_player_id (
          id,
          first_name,
          last_name,
          handicap,
          member_type
        )
      `);

    if (signupsError) {
      console.error("Error fetching signups:", signupsError);
    }

    // Combine tee times with their signups
    const teeTimesWithSignups = (teeTimesData || []).map((teeTime) => ({
      ...teeTime,
      signups: (signupsData || [])
        .filter((signup: any) => signup.tee_time_id === teeTime.id)
        .map((signup: any) => ({
          ...signup.players,
          subbing_for: signup.subbing_for
        }))
        .filter(Boolean),
    }));

    setTeeTimes(teeTimesWithSignups);
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("id, first_name, last_name, handicap, member_type")
      .order("last_name", { ascending: true });

    if (error) {
      console.error("Error fetching players:", error);
    } else {
      setPlayers((data || []) as Player[]);
    }
  };

  const handleSignUp = async (playerId: string, subbingForPlayerId?: string) => {
    if (!selectedTeeTime) return;

    const insertData: any = {
      tee_time_id: selectedTeeTime,
      player_id: playerId,
    };

    if (subbingForPlayerId) {
      insertData.subbing_for_player_id = subbingForPlayerId;
    }

    const { error } = await supabase.from("tee_time_signups").insert(insertData);

    if (error) {
      if (error.code === "23505") {
        toast.error("This player is already signed up for this tee time");
      } else {
        console.error("Error signing up:", error);
        toast.error("Failed to sign up. Please try again.");
      }
    } else {
      toast.success("Successfully signed up!");
      setDialogOpen(false);
      setSelectedPlayer(null);
      setSubbingForId("");
      fetchTeeTimes();
    }
  };

  const handleRemove = async (playerId: string) => {
    if (!selectedTeeTime) return;

    const { error } = await supabase
      .from("tee_time_signups")
      .delete()
      .eq("tee_time_id", selectedTeeTime)
      .eq("player_id", playerId);

    if (error) {
      console.error("Error removing signup:", error);
      toast.error("Failed to remove signup. Please try again.");
    } else {
      toast.success("Successfully removed!");
      setRemoveDialogOpen(false);
      fetchTeeTimes();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Loading tee times...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Tee Times</h1>
          <p className="text-muted-foreground text-lg">
            Browse available tee times at SCP Golf Course
          </p>
        </div>

        <div className="space-y-6">
          {teeTimes.length === 0 ? (
            <Card className="shadow-card bg-gradient-card">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tee times available at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            teeTimes.map((teeTime) => (
              <Card key={teeTime.id} className="shadow-card bg-gradient-card">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl md:text-2xl mb-2">{teeTime.course}</CardTitle>
                        <div className="text-base">
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {teeTime.date
                                ? format(new Date(`${teeTime.date}T00:00:00`), 'EEEE, MMMM d, yyyy')
                                : teeTime.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {teeTime.time 
                                ? (() => {
                                    const [hours, minutes] = teeTime.time.split(':');
                                    const hour = parseInt(hours);
                                    const period = hour >= 12 ? 'PM' : 'AM';
                                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                    return `${displayHour}:${minutes} ${period}`;
                                  })()
                                : teeTime.time}
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={dialogOpen && selectedTeeTime === teeTime.id} onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) {
                          setSelectedTeeTime(null);
                          setSelectedPlayer(null);
                          setSubbingForId("");
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedTeeTime(teeTime.id);
                              setDialogOpen(true);
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {selectedPlayer ? `Sign Up: ${selectedPlayer.first_name} ${selectedPlayer.last_name}` : "Select Member to Sign Up"}
                            </DialogTitle>
                            <DialogDescription>
                              {selectedPlayer 
                                ? selectedPlayer.member_type === 'sub' 
                                  ? "Select which regular member this sub is playing for"
                                  : "Confirm signup for this member"
                                : "Choose which member to sign up for this tee time"
                              }
                            </DialogDescription>
                          </DialogHeader>
                          
                          {!selectedPlayer ? (
                            <div className="grid gap-2 py-4 max-h-[400px] overflow-y-auto">
                              {players.map((player) => (
                                <Button
                                  key={player.id}
                                  variant="outline"
                                  onClick={() => {
                                    if (player.member_type === 'sub') {
                                      setSelectedPlayer(player);
                                    } else {
                                      handleSignUp(player.id);
                                    }
                                  }}
                                  className="justify-start"
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  {player.first_name} {player.last_name}
                                  <Badge 
                                    variant={player.member_type === 'regular' ? 'default' : 'secondary'} 
                                    className="ml-2"
                                  >
                                    {player.member_type === 'regular' ? 'Regular' : 'Sub'}
                                  </Badge>
                                  {player.handicap !== null && (
                                    <span className="ml-auto text-muted-foreground">
                                      HCP: {player.handicap}
                                    </span>
                                  )}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <div className="py-4 space-y-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedPlayer(null);
                                  setSubbingForId("");
                                }}
                                className="mb-2"
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to members
                              </Button>
                              
                              <div className="space-y-2">
                                <Label htmlFor="subbing-for">Who are you subbing for? *</Label>
                                <Select value={subbingForId} onValueChange={setSubbingForId}>
                                  <SelectTrigger id="subbing-for">
                                    <SelectValue placeholder="Select a regular member" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {regularMembers.map((member) => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.first_name} {member.last_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <Button 
                                onClick={() => handleSignUp(selectedPlayer.id, subbingForId)}
                                disabled={!subbingForId}
                                className="w-full"
                              >
                                Confirm Sign Up
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Dialog open={removeDialogOpen && selectedTeeTime === teeTime.id} onOpenChange={(open) => {
                        setRemoveDialogOpen(open);
                        if (!open) setSelectedTeeTime(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTeeTime(teeTime.id);
                              setRemoveDialogOpen(true);
                            }}
                            disabled={!teeTime.signups || teeTime.signups.length === 0}
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select Member to Remove</DialogTitle>
                            <DialogDescription>
                              Choose which member to remove from this tee time
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-2 py-4 max-h-[400px] overflow-y-auto">
                            {teeTime.signups?.map((player) => (
                              <Button
                                key={player.id}
                                variant="outline"
                                onClick={() => handleRemove(player.id)}
                                className="justify-start"
                              >
                                <Users className="mr-2 h-4 w-4" />
                                {player.first_name} {player.last_name}
                                {player.handicap !== null && (
                                  <span className="ml-auto text-muted-foreground">
                                    HCP: {player.handicap}
                                  </span>
                                )}
                              </Button>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                {teeTime.signups && teeTime.signups.length > 0 && (
                  <CardContent>
                    <div className="space-y-1">
                      <h3 className="font-semibold flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        Signed Up Members ({teeTime.signups.length})
                      </h3>
                      <div className="grid gap-1">
                        {teeTime.signups.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-1.5 rounded-md bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {player.first_name} {player.last_name}
                              </span>
                              {player.member_type === 'sub' && player.subbing_for && (
                                <span className="text-xs text-muted-foreground">
                                  (subbing for {player.subbing_for.first_name} {player.subbing_for.last_name})
                                </span>
                              )}
                            </div>
                            {player.handicap !== null && (
                              <span className="text-sm text-muted-foreground">
                                HCP: {player.handicap}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeeTimes;
