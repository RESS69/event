import { Save } from 'lucide-react';
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { Button } from "@/components/ui/Button";

const CreateEvent = () => {
  return (
    <main className="flex">

     <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title="Create Event"
          countLabel="Create Event"
          actions={
            <Button variant="primary" size="add">
              <Save size={18} strokeWidth={2.5} />
              Create Event
            </Button>
          }
        />
        <div className="px-6 pt-6 pb-2">
        <PageSection>
          <p className="text-sm text-gray-700">
            ที่นี่คือพื้นที่ Dashboard (เดี๋ยวค่อยเอา card สรุปตัวเลขกับ
            schedule มาใส่)
          </p>
        </PageSection>
        
        <PageSection>
          <p className="text-sm text-gray-700">
            ที่นี่คือพื้นที่ Dashboard (เดี๋ยวค่อยเอา card สรุปตัวเลขกับ
            schedule มาใส่)
          </p>
        </PageSection>
        </div>
      </div>
    </main>
  );
};
export default CreateEvent;
