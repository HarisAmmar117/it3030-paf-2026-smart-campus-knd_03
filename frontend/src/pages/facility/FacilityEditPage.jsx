import { useParams } from "react-router-dom";
import ResourceEditForm from "../../components/facility/ResourceEditForm";

export default function FacilityEditPage() {
  const { id } = useParams();
  return <ResourceEditForm resourceId={id} />;
}
