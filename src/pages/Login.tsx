
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  nationalId: z.string().min(10, {
    message: "Isikukood peab olema vähemalt 10 märki pikk.",
  }),
  password: z.string().min(6, {
    message: "Parool peab olema vähemalt 6 märki pikk.",
  }),
});

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nationalId: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    try {
      await login(values.nationalId, values.password);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Teadmata viga");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-yellow-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-green-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-800">MTÜ Tartu Pereliit</CardTitle>
            <CardDescription className="text-gray-600">
              Sisestage oma andmed kontole ligipääsemiseks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-800">Isikukood</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Sisestage oma isikukood" 
                          {...field} 
                          className="border-green-200 focus:border-green-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-800">Parool</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="border-green-200 focus:border-green-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sisselogimine..." : "Logi sisse"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t border-green-100">
            <div className="text-center text-sm text-gray-600">
              Pole veel kontot?{" "}
              <Link to="/register" className="text-green-700 hover:underline font-medium">
                Registreeru
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
