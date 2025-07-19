-- CreateTable
CREATE TABLE "UserLocations" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserLocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userLocationsId" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userLocationsId_fkey" FOREIGN KEY ("userLocationsId") REFERENCES "UserLocations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
