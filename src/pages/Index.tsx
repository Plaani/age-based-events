
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <header className="relative py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-green-700">
                MTÜ Tartu Pereliit
              </h1>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed">
                Registreerige üritustele ja tegevustele kogu perega meie lihtsa ja sujuva platvormi kaudu
              </p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 text-white">
                <Link to="/login">Logi sisse</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-green-600 text-green-700 hover:bg-green-50">
                <Link to="/register">Registreeru</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="dashboard-card border-green-100 hover:border-green-300">
              <CardHeader className="pb-2">
                <Calendar className="h-12 w-12 text-green-600" />
                <CardTitle className="text-green-800">Ürituste broneerimine</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Sirvige ja broneerige vanusele sobivaid üritusi lihtsalt
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="dashboard-card border-yellow-100 hover:border-yellow-300">
              <CardHeader className="pb-2">
                <Users className="h-12 w-12 text-yellow-600" />
                <CardTitle className="text-green-800">Perekonna haldamine</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Registreeruge korra ja kaasake kogu oma perekond
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="dashboard-card border-green-100 hover:border-green-300">
              <CardHeader className="pb-2">
                <Clock className="h-12 w-12 text-green-600" />
                <CardTitle className="text-green-800">Tähtaegade jälgimine</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Püsige registreerimise tähtaegadega kursis meeldetuletuste abil
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="dashboard-card border-yellow-100 hover:border-yellow-300">
              <CardHeader className="pb-2">
                <CheckCircle className="h-12 w-12 text-yellow-600" />
                <CardTitle className="text-green-800">Sobivuse kontrollimine</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Turvaline kontroll isikukoodi kaudu
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-green-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-green-800">
                Valmis alustama?
              </h2>
              <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed">
                Liituge meie platvormiga juba täna ja alustage ürituste avastamist kogu perega.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg" asChild>
                <Link to="/register">Registreeru kohe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-100 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2025 MTÜ Tartu Pereliit. Kõik õigused kaitstud.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
