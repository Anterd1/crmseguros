"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function ReportsCharts({ monthlyData, distributionData }: { monthlyData: any[], distributionData: any[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Monthly Production Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Producción Mensual ({new Date().getFullYear()})</CardTitle>
                    <CardDescription>Primas netas cobradas por mes.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer
                        config={{
                            total: {
                                label: "Total Cobrado",
                                color: "hsl(var(--primary))",
                            },
                        }}
                        className="h-[350px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Portfolio Distribution Chart */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Distribución de Cartera</CardTitle>
                    <CardDescription>Por tipo de seguro.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            autos: { label: "Autos", color: "hsl(var(--chart-1))" },
                            gmm: { label: "GMM", color: "hsl(var(--chart-2))" },
                            vida: { label: "Vida", color: "hsl(var(--chart-3))" },
                            daños: { label: "Daños", color: "hsl(var(--chart-4))" },
                            otros: { label: "Otros", color: "hsl(var(--chart-5))" },
                        }}
                        className="h-[350px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
