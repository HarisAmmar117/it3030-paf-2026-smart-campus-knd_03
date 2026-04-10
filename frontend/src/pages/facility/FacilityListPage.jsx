import { isUserRole } from "../../utils/authSession";
import ResourceList from "../../components/facility/ResourceList";
import UserResources from "../../components/facility/UserResources";

export default function FacilityListPage() {
  if (isUserRole()) {
    return <UserResources />;
  }
  return <ResourceList />;
}
