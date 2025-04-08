import { EmailDraft } from "@/types/recommendations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface EmailSectionProps {
  drafts: EmailDraft[];
}

export function EmailSection({ drafts }: EmailSectionProps) {
  const openInEmailClient = (draft: EmailDraft) => {
    const mailtoLink = `mailto:${draft.recipient.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.content)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Draft Emails</h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drafts.map((draft, index) => (
          <Card key={index} className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{draft.recipient.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {draft.category === 'aligned' ? '✓ Aligned'
                    : draft.category === 'opposing' ? '❌ Opposing'
                    : '⚡ Key Decision Maker'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {draft.recipient.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {draft.recipient.email}
              </p>
            </div>

            <div>
              <h5 className="font-medium mb-1">Subject</h5>
              <p className="text-sm text-muted-foreground">
                {draft.subject}
              </p>
            </div>

            <div>
              <h5 className="font-medium mb-1">Preview</h5>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {draft.content}
              </p>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => openInEmailClient(draft)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Open in Email Client
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
