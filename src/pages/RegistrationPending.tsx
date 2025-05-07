
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";

const RegistrationPending: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-yellow-100 p-3">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-center">Registration Pending</CardTitle>
            <CardDescription className="text-center">
              Your account is awaiting approval by an administrator
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Thank you for registering! Your account has been created and is now pending approval.
            </p>
            <p className="text-gray-600">
              You'll receive an email notification once your account has been approved.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPending;
