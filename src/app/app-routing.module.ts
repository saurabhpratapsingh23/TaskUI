import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";

import { SCSEmployeeComponent } from "./pages/scsemployee/scsemployee.component";
import { SCSEmployeedetailsComponent } from "./pages/scsemployee/scsemployeedetails/scsemployeedetails.component";

import { PropertiesComponent } from "./pages/properties/properties.component";
import { PropertiesdetailsComponent } from "./pages/properties/propertiesdetails/propertiesdetails.component";

import { OwnersComponent } from "./pages/owners/owners.component";
import { OwnersdetailsComponent } from "./pages/owners/ownersdetails/ownersdetails.component";
import { AppointmentsComponent } from "./pages/appointments/appointments.component";
import { AppointmentsdetailsComponent } from "./pages/appointments/appointmentsdetails/appointmentsdetails.component";
import { TenantsComponent } from "./pages/tenants/tenants.component";
import { TenantsdetailsComponent } from "./pages/tenants/tenantsdetails/tenantsdetails.component";

const routes: Routes = [
  { path: "", redirectTo: "/properties", pathMatch: "full" },
  { path: "login", component: LoginComponent },

  { path: "owner", component: SCSEmployeeComponent },
  {
    path: "owner/ownerdetails",
    component: SCSEmployeedetailsComponent,
  },
  { path: "properties", component: PropertiesComponent },
  {
    path: "properties/propertiesdetails",
    component: PropertiesdetailsComponent,
  },

  { path: "owners", component: OwnersComponent },
  {
    path: "owners/ownersdetails",
    component: OwnersdetailsComponent,
  },

  { path: "appointments", component: AppointmentsComponent },
  {
    path: "appointments/appointmentsdetails",
    component: AppointmentsdetailsComponent,
  },

  { path: "tenants", component: TenantsComponent },
  {
    path: "tenants/tenantsdetails",
    component: TenantsdetailsComponent,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, { useHash: true })],
})
export class AppRoutingModule {}
