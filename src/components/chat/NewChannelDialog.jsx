import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewChannelDialog({ open, onOpenChange, onAdd }) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Label>Channel Name</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. studio-a"
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!name.trim()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}